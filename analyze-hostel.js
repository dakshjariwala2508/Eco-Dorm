import {db} from 'hatchable';
import {validate} from 'lib/eco.js';
import {analyzeWithAI,toInsights,aiFailure} from 'lib/ai-analysis.js';
export const access='public';
export const methods=['POST'];
export default async function(req,res){
const error=validate(req.body);if(error)return res.status(400).json({error,code:'INVALID_INPUT'});
const {hostel,students,water,electricity,waste,temperature,ac,fan,lighting}=req.body;
const input={hostel:hostel.trim(),students,water,electricity,waste,temperature,ac,fan,lighting};
let history;try{history=(await db.query('SELECT * FROM hostel_records WHERE hostel=$1 ORDER BY created_at DESC LIMIT 14',[input.hostel])).rows;}catch{return res.status(500).json({error:'Could not read hostel history. Please retry.',code:'DATABASE_ERROR'});}
let result;try{result=await analyzeWithAI(input,history);}catch(e){const failure=aiFailure(e);return res.status(failure.status).json(failure.body);}
try{
await db.query('WITH record AS (INSERT INTO hostel_records(hostel,students,water,electricity,waste,temperature,ac,fan,lighting,block) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id) INSERT INTO hostel_insights(record_id,payload) SELECT id,$11::jsonb FROM record',
[input.hostel,students,water,electricity,waste,temperature,ac,fan,lighting,/^Block [A-D]$/.test(input.hostel)?input.hostel.slice(-1):null,JSON.stringify(toInsights(result))]);
return res.status(201).json(result);
}catch{return res.status(500).json({error:'Analysis could not be saved. Please retry.',code:'DATABASE_ERROR'});}
}