"use client";

import { FormEvent, useMemo, useState } from "react";
import { commercialPlans, salesChannels, type PlanId } from "@/lib/commercial-config";
import { createSalesId, upsertSalesLead } from "@/lib/sales-store";
import { normalizeWeddingSlug } from "@/lib/tenant";

type LeadFormState = {
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  source: string;
  planId: PlanId;
  message: string;
  slug: string;
};

const initialState: LeadFormState = {
  name: "",
  email: "",
  phone: "",
  weddingDate: "",
  source: salesChannels[0],
  planId: "live",
  message: "",
  slug: "",
};

export function LeadForm() {
  const [state, setState] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const suggestedSlug = useMemo(() => normalizeWeddingSlug(state.slug || state.name || "aleksandra-pawel-2028"), [state.name, state.slug]);
  const plan = commercialPlans.find((item) => item.id === state.planId) ?? commercialPlans[1];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.name.trim() || !state.email.trim()) return;
    const lead = { ...state, id: createSalesId("lead"), slug: suggestedSlug, status: "new" as const, createdAt: new Date().toISOString() };
    try {
      const response = await fetch("/api/sales/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!response.ok) throw new Error("API unavailable");
    } catch {
      upsertSalesLead(lead);
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-[#d8bd72]/30 bg-white p-6 shadow-xl shadow-stone-900/5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Dziekujemy</p>
        <h2 className="mt-2 text-2xl font-semibold">Odezwziemy sie z propozycja</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Dostalismy Twoje zapytanie. Przygotujemy rekomendowany zakres aplikacji i napiszemy, co najlepiej sprawdzi sie przy tym weselu.
        </p>
        <div className="mt-4 rounded-2xl bg-[#fffaf4] p-4 text-sm text-stone-700">
          <p><strong>Wybrany zakres:</strong> {plan.name}</p>
          <p><strong>Propozycja nazwy strony:</strong> {suggestedSlug}</p>
        </div>
        <button type="button" onClick={() => { setState(initialState); setSubmitted(false); }} className="mt-4 h-11 rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white">
          Wyslij kolejne zapytanie
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#d8bd72]/30 bg-white p-5 shadow-xl shadow-stone-900/5">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Zapytaj o oferte</p>
      <h2 className="mt-2 text-2xl font-semibold">Opowiedz nam o weselu</h2>
      <div className="mt-5 grid gap-3">
        <Field label="Imiona / kontakt">
          <input className={inputClass} value={state.name} onChange={(event) => setState({ ...state, name: event.target.value })} placeholder="Aleksandra i Pawel" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Email">
            <input className={inputClass} type="email" value={state.email} onChange={(event) => setState({ ...state, email: event.target.value })} placeholder="kontakt@email.pl" />
          </Field>
          <Field label="Telefon">
            <input className={inputClass} value={state.phone} onChange={(event) => setState({ ...state, phone: event.target.value })} placeholder="+48 ..." />
          </Field>
          <Field label="Data wesela">
            <input className={inputClass} type="date" value={state.weddingDate} onChange={(event) => setState({ ...state, weddingDate: event.target.value })} />
          </Field>
          <Field label="Zrodlo">
            <select className={inputClass} value={state.source} onChange={(event) => setState({ ...state, source: event.target.value })}>
              {salesChannels.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Interesujacy zakres">
          <select className={inputClass} value={state.planId} onChange={(event) => setState({ ...state, planId: event.target.value as PlanId })}>
            {commercialPlans.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.pricePln} zl</option>)}
          </select>
        </Field>
        <Field label="Proponowana nazwa strony">
          <input className={inputClass} value={state.slug} onChange={(event) => setState({ ...state, slug: event.target.value })} placeholder={suggestedSlug} />
        </Field>
        <p className="rounded-2xl bg-[#fffaf4] px-4 py-3 text-sm text-stone-600">Przykladowa nazwa strony: <strong>{suggestedSlug}</strong></p>
        <Field label="Notatka">
          <textarea className={`${inputClass} min-h-28`} value={state.message} onChange={(event) => setState({ ...state, message: event.target.value })} placeholder="Np. liczba gosci, czy potrzebny plan stolow, galeria zdjec, QR do druku." />
        </Field>
        <button className="h-12 rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#254b40]" type="submit">
          Popros o kontakt
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium text-stone-700"><span>{label}</span>{children}</label>;
}

const inputClass = "min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-[#2f7d6d] focus:ring-2 focus:ring-[#2f7d6d]/20";
