"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CountryCode } from "@/lib/postcodes";
import { getAreasForPostcode } from "@/lib/postcodes";

export type LeadFormData = {
  givenName: string;
  surname: string;
  gender: string;
  phone: string;
  email: string;
  country: CountryCode;
  postcode: string;
  areaName: string;
};

const INITIAL_FORM: LeadFormData = {
  givenName: "",
  surname: "",
  gender: "",
  phone: "",
  email: "",
  country: "SG",
  postcode: "",
  areaName: "",
};

type LeadFormProps = {
  onSubmit: (data: LeadFormData) => void;
};

export function LeadForm({ onSubmit }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [postcodeDropdownOpen, setPostcodeDropdownOpen] = useState(false);
  const postcodeDropdownRef = useRef<HTMLDivElement>(null);

  const areaOptions = getAreasForPostcode(form.country, form.postcode);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (postcodeDropdownRef.current && !postcodeDropdownRef.current.contains(e.target as Node)) {
        setPostcodeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const update = useCallback((field: keyof LeadFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (field === "country") {
      setForm((prev) => ({ ...prev, postcode: "", areaName: "" }));
    }
    if (field === "postcode") {
      setForm((prev) => ({ ...prev, areaName: "" }));
    }
  }, []);

  const handlePostcodeSelect = useCallback((postcode: string, areaName: string) => {
    setForm((prev) => ({ ...prev, postcode, areaName }));
    setPostcodeDropdownOpen(false);
  }, []);

  const validate = useCallback((): boolean => {
    const next: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.givenName.trim()) next.givenName = "Required";
    if (!form.surname.trim()) next.surname = "Required";
    if (!form.gender.trim()) next.gender = "Please select gender";
    if (!form.phone.trim()) next.phone = "Required";
    else if (!/^[\d\s\-+()]+$/.test(form.phone)) next.phone = "Invalid phone number";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Invalid email";
    }
    if (!form.postcode.trim()) next.postcode = "Required";
    if (!form.areaName.trim()) next.areaName = "Please select an area from the list";
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="givenName" className="mb-1 block text-sm font-medium text-slate-700">
              Given name <span className="text-red-500">*</span>
            </label>
            <input
              id="givenName"
              type="text"
              value={form.givenName}
              onChange={(e) => update("givenName", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
              placeholder="e.g. John"
              autoComplete="given-name"
            />
            {errors.givenName ? (
              <p className="mt-1 text-xs text-red-600">{errors.givenName}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="surname" className="mb-1 block text-sm font-medium text-slate-700">
              Surname <span className="text-red-500">*</span>
            </label>
            <input
              id="surname"
              type="text"
              value={form.surname}
              onChange={(e) => update("surname", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
              placeholder="e.g. Tan"
              autoComplete="family-name"
            />
            {errors.surname ? (
              <p className="mt-1 text-xs text-red-600">{errors.surname}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
            aria-invalid={!!errors.gender}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender ? (
            <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
            placeholder="e.g. +65 9123 4567"
            autoComplete="tel"
          />
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-slate-700">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              value={form.country}
              onChange={(e) => update("country", e.target.value as CountryCode)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
            >
              <option value="SG">Singapore</option>
              <option value="ID">Indonesia</option>
            </select>
          </div>
          <div className="relative" ref={postcodeDropdownRef}>
            <label htmlFor="postcode" className="mb-1 block text-sm font-medium text-slate-700">
              Post code <span className="text-red-500">*</span>
            </label>
            <input
              id="postcode"
              type="text"
              inputMode="numeric"
              value={form.postcode}
              onChange={(e) => {
                update("postcode", e.target.value);
                setPostcodeDropdownOpen(true);
              }}
              onFocus={() => setPostcodeDropdownOpen(true)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#F75202] focus:outline-none focus:ring-1 focus:ring-[#F75202]"
              placeholder={form.country === "SG" ? "e.g. 018956" : "e.g. 10110"}
              autoComplete="off"
            />
            {postcodeDropdownOpen && areaOptions.length > 0 ? (
              <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {areaOptions.map((opt, i) => (
                  <button
                    key={`${opt.postcode}-${opt.areaName}-${i}`}
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-800 hover:bg-orange-50"
                    onClick={() => handlePostcodeSelect(opt.postcode, opt.areaName)}
                  >
                    <span className="font-medium">{opt.postcode}</span>
                    <span className="ml-2 text-slate-500">{opt.areaName}</span>
                  </button>
                ))}
              </div>
            ) : null}
            {form.areaName ? (
              <p className="mt-1 text-xs text-slate-500">Area: {form.areaName}</p>
            ) : null}
            {errors.postcode ? (
              <p className="mt-1 text-xs text-red-600">{errors.postcode}</p>
            ) : errors.areaName ? (
              <p className="mt-1 text-xs text-red-600">{errors.areaName}</p>
            ) : null}
          </div>
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
