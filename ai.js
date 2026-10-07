import {db} from 'hatchable';
import {analyzeWithAI,toInsights,aiFailure} from 'lib/ai-analysis.js';
export const access='public';
export const methods=['POST'];
export default async function(req,res){
const id=req.body?.id;if(typeof id!=='string')return res.status(400).json({error:'Record ID required.'});
try{
const record=(await db.query('SELECT * FROM hostel_records WHERE id::text=$1',[id])).rows[0];
if(!record)return res.status(404).json({error:'Record not found.'});
const history=(await db.query('SELECT * FROM hostel_records WHERE hostel=$1 AND created_at<$2 ORDER BY created_at DESC LIMIT 14',[record.hostel,record.created_at])).rows;
let result;try{result=await analyzeWithAI(record,history);}catch(e){const failure=aiFailure(e);return res.status(failure.status).json(failure.body);}
await db.query('INSERT INTO hostel_insights(record_id,payload) VALUES($1,$2::jsonb) ON CONFLICT(record_id) DO UPDATE SET payload=EXCLUDED.payload',[id,JSON.stringify(toInsights(result))]);
return res.json(result);
}catch{return res.status(500).json({error:'Could not load or save the analysis. Please retry.'});}
}