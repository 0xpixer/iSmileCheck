"use client";

import { useCallback, useState } from "react";

const PHONE_COUNTRY_OPTIONS = [
  { code: "+65", label: "Singapore", flag: "🇸🇬" },
  { code: "+62", label: "Indonesia", flag: "🇮🇩" },
  { code: "+66", label: "Thailand", flag: "🇹🇭" },
] as const;

export type LeadFormData = {
  name: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
};

const INITIAL_FORM: LeadFormData = {
  name: "",
  phoneCountryCode: "+65",
  phone: "",
  email: "",
};

type LeadFormProps = {
  onSubmit: (data: LeadFormData) => void;
};

export function LeadForm({ onSubmit }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const update = useCallback((field: keyof LeadFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const next: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.phone.trim()) next.phone = "Required";
    else if (!/^[\d\s\-()]+$/.test(form.phone)) next.phone = "Invalid phone number";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Invalid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      onSubmit(form);
    },
    [form, validate, onSubmit]
  );

  return (
    <section className="rounded-3xl border border-orange-100 bg-white p-5 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
        Your details
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Complete the form below to see your before &amp; after comparison.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
            placeholder="e.g. John Tan"
            autoComplete="name"
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              id="phone-country"
              value={form.phoneCountryCode}
              onChange={(e) => update("phoneCountryCode", e.target.value)}
              className="w-30 shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
              aria-label="Country code"
            >
              {PHONE_COUNTRY_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.flag} {opt.code}
                </option>
              ))}
            </select>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
              placeholder="e.g. 9123 4567"
              autoComplete="tel-national"
            />
          </div>
          {errors.phone ? (
            <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
            placeholder="e.g. john@example.com"
            autoComplete="email"
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-[#F75202] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E04A00]"
        >
          Submit &amp; see my comparison
        </button>
      </form>
    </section>
  );
}
