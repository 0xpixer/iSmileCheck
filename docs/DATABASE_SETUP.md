# Database setup (Vercel + Neon) for lead form storage

Lead form submissions are stored in Postgres. Use **Neon** with your Vercel project so `DATABASE_URL` is set automatically.

## 1. Add Neon to your Vercel project (from GitHub)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) and select your project (or import the repo from GitHub if needed).
2. Go to the **Storage** tab, or open [Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=postgres).
3. Find **Neon** and click **Add** / **Integrate**.
4. Follow the steps to create a Neon account (if needed) and connect it to this Vercel project.
5. When prompted, link the integration to your project. Vercel will inject **`DATABASE_URL`** into your project’s environment variables (for Production, Preview, and optionally Development).

## 2. Create the `leads` table in Neon

1. In the Vercel project, go to **Storage** → your Neon database, or open the [Neon Console](https://console.neon.tech).
2. Open the **SQL Editor** for your database.
3. Run the schema from this repo:

```sql
-- From sql/leads_schema.sql
CREATE TABLE IF NOT EXISTS leads (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone_country_code TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  agree_to_terms BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
```

## 3. Local development

1. In the Neon dashboard, copy the connection string (or use the one from Vercel’s env after linking).
2. In the project root, copy `.env.example` to `.env.local` and set:

```bash
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

3. Run the same `CREATE TABLE` SQL in Neon’s SQL Editor (step 2) if the table doesn’t exist yet.

After this, deploying from GitHub to Vercel will use the linked Neon database and lead form submissions will be stored in the `leads` table.
