INSERT INTO hostel_records(hostel,block,students,water,electricity,waste,temperature,ac,fan,lighting,demo,created_at)
SELECT 'Block '||b,b,CASE b WHEN 'A' THEN 150 WHEN 'B' THEN 180 WHEN 'C' THEN 120 ELSE 160 END,
(CASE b WHEN 'A' THEN 16000 WHEN 'B' THEN 22000 WHEN 'C' THEN 11500 ELSE 18000 END)*(1+0.045*sin(d)),
(CASE b WHEN 'A' THEN 580 WHEN 'B' THEN 980 WHEN 'C' THEN 420 ELSE 750 END)*(1+0.06*cos(d)),
(CASE b WHEN 'A' THEN 65 WHEN 'B' THEN 115 WHEN 'C' THEN 45 ELSE 85 END)*(1+0.04*sin(d)),
CASE b WHEN 'B' THEN 32 ELSE 27 END,CASE b WHEN 'B' THEN 12 ELSE 7 END,10,9,true,
now()-make_interval(days=>d) FROM unnest(ARRAY['A','B','C','D']) b CROSS JOIN generate_series(0,29) d WHERE NOT EXISTS (SELECT 1 FROM hostel_records);
UPDATE hostel_records SET water=24000 WHERE block='A' AND created_at>(now()-interval '1 hour');