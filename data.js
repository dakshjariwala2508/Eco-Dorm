import {db} from 'hatchable';
import {score,insights,assumptions} from 'lib/eco.js';
export const access='public'; export const methods=['GET'];
export default async function(req,res){
const rows=(await db.query('SELECT * FROM hostel_records ORDER BY created_at DESC LIMIT 500')).rows;
const latest={};for(const r of rows)if(!latest[r.hostel])latest[r.hostel]=score(r);
const selected=latest[req.query.hostel]||Object.values(latest)[0];
const cached=selected?(await db.query('SELECT payload FROM hostel_insights WHERE record_id=$1',[selected.id])).rows[0]:null;
res.json({records:rows.map(score),blocks:Object.values(latest).filter(r=>r.block),hostels:Object.values(latest),selected,insights:selected?(cached?.payload||insights(selected,rows.filter(r=>r.hostel===selected.hostel&&r.id!==selected.id))):null,assumptions});
}