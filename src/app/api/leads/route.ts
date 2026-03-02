import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export type LeadPayload = {
  name: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  agreeToTerms: boolean;
};

export async function POST(request: Request) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json(
      { error: "Database not configured. Add Neon (or Postgres) and set DATABASE_URL." },
      { status: 503 }
    );
  }

  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, phoneCountryCode, phone, email, agreeToTerms } = body;
  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: "Name and phone are required." },
      { status: 400 }
    );
  }

  try {
    const sql = neon(connectionString);
    await sql`
      INSERT INTO leads (name, phone_country_code, phone, email, agree_to_terms)
      VALUES (${name.trim()}, ${phoneCountryCode ?? "+65"}, ${phone.trim()}, ${email?.trim() || null}, ${!!agreeToTerms})
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save lead.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
