import {db} from 'hatchable';import {validate,score,insights} from 'lib/eco.js';
export const access='public';export const methods=['POST'];
export default async function(req,res){const b=req.body;const error=validate(b);if(error)return res.status(400).json({error});
const history=(await db.query('SELECT * FROM hostel_records WHERE hostel=$1 ORDER BY created_at DESC LIMIT 14',[b.hostel.trim()])).rows;
const r=(await db.query('INSERT INTO hostel_records(hostel,students,water,electricity,waste,temperature,ac,fan,lighting,block) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',[b.hostel.trim(),b.students,b.water,b.electricity,b.waste,b.temperature,b.ac,b.fan,b.lighting,/^Block [A-D]$/.test(b.hostel.trim())?b.hostel.trim().slice(-1):null])).rows[0];
const result=insights(r,history);await db.query('INSERT INTO hostel_insights(record_id,payload) VALUES($1,$2::jsonb)',[r.id,JSON.stringify(result)]);
res.status(201).json({record:score(r),insights:result});}