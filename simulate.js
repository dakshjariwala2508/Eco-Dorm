import {db} from 'hatchable';import {simulate} from 'lib/eco.js';
export const access='public';export const methods=['POST'];
export default async function(req,res){const b=req.body||{};for(const k of ['ac','water','led'])if(typeof b[k]!=='number'||!Number.isFinite(b[k])||b[k]<0||b[k]>100)return res.status(400).json({error:'Reduction percentages must be between 0 and 100.'});
if(!Number.isInteger(b.occupancy)||b.occupancy<1||b.occupancy>10000)return res.status(400).json({error:'Occupancy must be 1–10,000.'});
if(typeof b.id!=='string')return res.status(400).json({error:'Record ID required.'});
const r=(await db.query('SELECT * FROM hostel_records WHERE id::text=$1',[b.id])).rows[0];if(!r)return res.status(404).json({error:'Record not found.'});res.json(simulate(r,b));}