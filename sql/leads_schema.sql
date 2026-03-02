-- Run this in your Neon (or other Postgres) database to create the leads table.
-- In Vercel: add Neon from Marketplace, then run this in the Neon SQL Editor.

CREATE TABLE IF NOT EXISTS leads (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone_country_code TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  agree_to_terms BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional: index for listing by date
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
