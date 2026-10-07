CREATE TABLE IF NOT EXISTS hostel_records (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(), hostel TEXT NOT NULL, block TEXT,
students INTEGER NOT NULL CHECK(students>0), water DOUBLE PRECISION NOT NULL CHECK(water>=0),
electricity DOUBLE PRECISION NOT NULL CHECK(electricity>=0), waste DOUBLE PRECISION NOT NULL CHECK(waste>=0),
temperature DOUBLE PRECISION NOT NULL, ac DOUBLE PRECISION NOT NULL, fan DOUBLE PRECISION NOT NULL,
lighting DOUBLE PRECISION NOT NULL, demo BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now());
CREATE INDEX IF NOT EXISTS hostel_recent ON hostel_records(hostel,created_at DESC);
CREATE TABLE IF NOT EXISTS hostel_insights (record_id UUID PRIMARY KEY REFERENCES hostel_records(id), payload JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now());