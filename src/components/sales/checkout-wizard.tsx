"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { commercialPlans, formatPlanPrice, type PlanId } from "@/lib/commercial-config";
import { createWeddingInstance, saveWeddingInstances, readWeddingInstances, type CheckoutDraft, type WeddingInstance } from "@/lib/sales-store";
import { getPublicWeddingUrl, normalizeWeddingSlug } from "@/lib/tenant";

const initialDraft: CheckoutDraft = {
  coupleNames: "",
  ownerEmail: "",
  phone: "",
  weddingDate: "",
  planId: "live",
  slug: "",
  paymentMode: "manual",
};

export function CheckoutWizard() {
  const [draft, setDraft] = useState(initialDraft);
  const [created, setCreated] = useState<WeddingInstance | null>(null);
  const [saveMode, setSaveMode] = useState<"api" | "local" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const suggestedSlug = useMemo(() => normalizeWeddingSlug(draft.slug || draft.coupleNames || "nasze-wesele"), [draft.coupleNames, draft.slug]);
  const plan = commercialPlans.find((item) => item.id === draft.planId) ?? commercialPlans[1];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.coupleNames.trim() || !draft.ownerEmail.trim() || !suggestedSlug) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/sales/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, slug: suggestedSlug }),
      });
      const result = await response.json();
      if (!response.ok || !result.instance) throw new Error(result.error ?? "API unavailable");
      const instance = result.instance as WeddingInstance;
      saveWeddingInstances([instance, ...readWeddingInstances().filter((item) => item.slug !== instance.slug)]);
      setCreated(instance);
      setSaveMode("api");
    } catch {
      const instance = createWeddingInstance({ ...draft, slug: suggestedSlug });
      setCreated(instance);
      setSaveMode("local");
    } finally {
      setIsSaving(false);
    }
  }

  if (created) {
    const publicUrl = getPublicWeddingUrl(created.slug);
    return (
      <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-3xl border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Instancja utworzona</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-normal">{created.coupleNames}</h2>
          <p className="mt-3 leading-7 text-stone-600">System przygotowal adres publiczny, wejscie do panelu oraz prefix storage. W wersji produkcyjnej ten krok bedzie odpalany po webhooku platnosci.</p>
          {saveMode === "api" && <p className="mt-4 rounded-2xl bg-[#e0f0eb] px-4 py-3 text-sm font-semibold text-[#1f5f52]">Instancja zostala utworzona przez API w Supabase.</p>}
          {saveMode === "local" && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">Supabase nie jest skonfigurowany lokalnie, instancja dziala w fallbacku przegladarki.</p>}
          <div className="mt-6 grid gap-3">
            <LinkCard label="Strona dla gosci" value={created.publicPath} href={created.publicPath} />
            <LinkCard label="Panel pary" value={`${created.adminPath}/panel`} href={`${created.adminPath}/panel`} />
            <CopyCard label="Pelny link publiczny" value={publicUrl} />
            <CopyCard label="Storage" value={created.storagePrefix} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sprzedaz" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white">Panel sprzedazy <ArrowRight className="size-4" /></Link>
            <button type="button" onClick={() => { setDraft(initialDraft); setCreated(null); }} className="h-11 rounded-full border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-700">Utworz kolejne</button>
          </div>
        </div>
        <InstanceSummary instance={created} />
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <form onSubmit={submit} className="rounded-3xl border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Po zakupie</p>
        <h2 className="mt-2 text-4xl font-semibold tracking-normal">Utworz instancje wesela</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">Wprowadz dane pary. System wygeneruje adres publiczny, panel pary i limity pakietu.</p>
        <div className="mt-6 grid gap-4">
          <Field label="Imiona pary / nazwa wesela">
            <input className={inputClass} value={draft.coupleNames} onChange={(event) => setDraft({ ...draft, coupleNames: event.target.value })} placeholder="Anna i Michal" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email wlasciciela">
              <input className={inputClass} type="email" value={draft.ownerEmail} onChange={(event) => setDraft({ ...draft, ownerEmail: event.target.value })} placeholder="para@email.pl" />
            </Field>
            <Field label="Telefon">
              <input className={inputClass} value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} placeholder="+48 ..." />
            </Field>
            <Field label="Data wesela">
              <input className={inputClass} type="date" value={draft.weddingDate} onChange={(event) => setDraft({ ...draft, weddingDate: event.target.value })} />
            </Field>
            <Field label="Pakiet">
              <select className={inputClass} value={draft.planId} onChange={(event) => setDraft({ ...draft, planId: event.target.value as PlanId })}>
                {commercialPlans.map((item) => <option key={item.id} value={item.id}>{item.name} - {formatPlanPrice(item.pricePln)}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Adres / slug">
            <input className={inputClass} value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder={suggestedSlug} />
          </Field>
          <div className="rounded-2xl border border-[#d8bd72]/25 bg-[#fffaf4] p-4">
            <p className="text-sm text-stone-600">Po utworzeniu powstanie:</p>
            <p className="mt-2 break-all text-sm font-semibold text-stone-900">/w/{suggestedSlug}</p>
            <p className="break-all text-sm font-semibold text-stone-900">/app/{suggestedSlug}</p>
          </div>
          <div className="grid gap-2 rounded-2xl border border-stone-200 p-3">
            <label className="flex items-center gap-3 text-sm font-medium text-stone-700"><input type="radio" checked={draft.paymentMode === "manual"} onChange={() => setDraft({ ...draft, paymentMode: "manual" })} /> Platnosc reczna / oczekuje</label>
            <label className="flex items-center gap-3 text-sm font-medium text-stone-700"><input type="radio" checked={draft.paymentMode === "paid"} onChange={() => setDraft({ ...draft, paymentMode: "paid" })} /> Platnosc potwierdzona</label>
          </div>
          <button className="h-12 rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#254b40] disabled:opacity-60" type="submit" disabled={isSaving}>{isSaving ? "Tworze..." : "Utworz instancje"}</button>
        </div>
      </form>
      <div className="rounded-3xl border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5">
        <ShieldCheck className="size-8 text-[#2f5d50]" />
        <h3 className="mt-4 text-2xl font-semibold">{plan.name}</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">{plan.tagline}</p>
        <p className="mt-5 text-4xl font-semibold">{formatPlanPrice(plan.pricePln)}</p>
        <div className="mt-5 grid gap-2 text-sm text-stone-700">
          <PlanLine text={`${plan.storageGb} GB storage`} />
          <PlanLine text={`${plan.videoMinutes} minut wideo`} />
          <PlanLine text={`${plan.weddingMonths} miesiecy hostingu`} />
          {plan.features.slice(0, 5).map((feature) => <PlanLine key={feature} text={feature} />)}
        </div>
      </div>
    </section>
  );
}

function InstanceSummary({ instance }: { instance: WeddingInstance }) {
  return (
    <div className="rounded-3xl border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Podsumowanie</p>
      <div className="mt-5 grid gap-3 text-sm">
        <SummaryRow label="Status" value={instance.status} />
        <SummaryRow label="Pakiet" value={instance.planId} />
        <SummaryRow label="Storage" value={`${instance.storageLimitGb} GB`} />
        <SummaryRow label="Wygasa" value={new Date(instance.expiresAt).toLocaleDateString("pl-PL")} />
        <SummaryRow label="Email" value={instance.ownerEmail} />
      </div>
    </div>
  );
}

function LinkCard({ label, value, href }: { label: string; value: string; href: string }) {
  return <Link href={href} className="flex items-center justify-between gap-4 rounded-2xl bg-[#fffaf4] p-4 text-sm transition hover:bg-[#f8efe3]"><span><span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</span><strong className="mt-1 block break-all text-stone-950">{value}</strong></span><ExternalLink className="size-4 shrink-0 text-[#2f5d50]" /></Link>;
}

function CopyCard({ label, value }: { label: string; value: string }) {
  return <button type="button" onClick={() => navigator.clipboard?.writeText(value)} className="flex items-center justify-between gap-4 rounded-2xl bg-[#fffaf4] p-4 text-left text-sm transition hover:bg-[#f8efe3]"><span><span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</span><strong className="mt-1 block break-all text-stone-950">{value}</strong></span><Copy className="size-4 shrink-0 text-[#2f5d50]" /></button>;
}

function PlanLine({ text }: { text: string }) {
  return <div className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#2f7d6d]" />{text}</div>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 rounded-2xl bg-[#fffaf4] px-4 py-3"><span className="text-stone-500">{label}</span><strong className="break-all text-right">{value}</strong></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium text-stone-700"><span>{label}</span>{children}</label>;
}

const inputClass = "min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-[#2f7d6d] focus:ring-2 focus:ring-[#2f7d6d]/20";
