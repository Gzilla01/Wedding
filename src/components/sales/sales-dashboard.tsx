"use client";

import Link from "next/link";
import { useState } from "react";
import { useSyncExternalStore } from "react";
import { ArrowRight, ExternalLink, RefreshCcw } from "lucide-react";
import { getPlan } from "@/lib/commercial-config";
import {
  SALES_LEADS_STORAGE_KEY,
  WEDDING_INSTANCES_STORAGE_KEY,
  readSalesLeads,
  readWeddingInstances,
  saveSalesLeads,
  saveWeddingInstances,
  updateWeddingInstanceStatus,
  type SalesLead,
  type SalesLeadStatus,
  type WeddingInstance,
  type WeddingInstanceStatus,
} from "@/lib/sales-store";

type SalesSnapshot = {
  leads: SalesLead[];
  instances: WeddingInstance[];
};

const emptySnapshot: SalesSnapshot = { leads: [], instances: [] };

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const events = ["storage", `${SALES_LEADS_STORAGE_KEY}:change`, `${WEDDING_INSTANCES_STORAGE_KEY}:change`];
  events.forEach((event) => window.addEventListener(event, callback));
  return () => events.forEach((event) => window.removeEventListener(event, callback));
}

let cachedLeadsRaw = "";
let cachedInstancesRaw = "";
let cachedSnapshot = emptySnapshot;

function getSnapshot() {
  if (typeof window === "undefined") return emptySnapshot;
  const leadsRaw = window.localStorage.getItem(SALES_LEADS_STORAGE_KEY) ?? "[]";
  const instancesRaw = window.localStorage.getItem(WEDDING_INSTANCES_STORAGE_KEY) ?? "[]";
  if (leadsRaw === cachedLeadsRaw && instancesRaw === cachedInstancesRaw) return cachedSnapshot;
  cachedLeadsRaw = leadsRaw;
  cachedInstancesRaw = instancesRaw;
  cachedSnapshot = {
    leads: readSalesLeads(),
    instances: readWeddingInstances(),
  };
  return cachedSnapshot;
}

export function SalesDashboard() {
  const { leads, instances } = useSyncExternalStore(subscribe, getSnapshot, () => emptySnapshot);
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "ok" | "fallback">("idle");
  const activeInstances = instances.filter((item) => item.status === "active").length;
  const pendingInstances = instances.filter((item) => item.status === "payment_pending").length;
  const projectedRevenue = instances.reduce((sum, instance) => sum + getPlan(instance.planId).pricePln, 0);

  function setLeadStatus(id: string, status: SalesLeadStatus) {
    saveSalesLeads(leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  }

  async function syncInstances() {
    setSyncStatus("loading");
    try {
      const response = await fetch("/api/sales/instances");
      const result = await response.json();
      if (!response.ok || !Array.isArray(result.instances)) throw new Error(result.error ?? "API unavailable");
      saveWeddingInstances(result.instances as WeddingInstance[]);
      setSyncStatus("ok");
    } catch {
      setSyncStatus("fallback");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Leady" value={leads.length.toString()} />
        <Metric label="Instancje" value={instances.length.toString()} />
        <Metric label="Aktywne" value={activeInstances.toString()} />
        <Metric label="Przychod brutto" value={`${projectedRevenue.toLocaleString("pl-PL")} zl`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Panel title="Instancje wesel" action={<div className="flex flex-wrap gap-2"><button type="button" onClick={syncInstances} className="inline-flex h-9 items-center gap-2 rounded-full border border-stone-300 bg-white px-4 text-xs font-semibold text-stone-700">{syncStatus === "loading" ? "Synchronizuje..." : "Sync API"}</button><Link href="/zamowienie" className="inline-flex h-9 items-center gap-2 rounded-full bg-[#2f5d50] px-4 text-xs font-semibold text-white">Nowe wesele <ArrowRight className="size-3.5" /></Link></div>}>
          {syncStatus === "ok" && <p className="mb-3 rounded-2xl bg-[#e0f0eb] px-4 py-3 text-sm font-semibold text-[#1f5f52]">Instancje zsynchronizowane z API/Supabase.</p>}
          {syncStatus === "fallback" && <p className="mb-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">API/Supabase niedostepne, pokazuje lokalny fallback.</p>}
          <div className="grid gap-3">
            {instances.length === 0 && <Empty text="Nie ma jeszcze utworzonych instancji. Utworz pierwsza przez /zamowienie." />}
            {instances.map((instance) => (
              <article key={instance.id} className="rounded-2xl border border-[#d8bd72]/20 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{instance.coupleNames}</p>
                    <p className="mt-1 text-sm text-stone-500">{instance.ownerEmail} / {instance.weddingDate || "brak daty"}</p>
                  </div>
                  <StatusPill status={instance.status} />
                </div>
                <div className="mt-4 grid gap-2 rounded-2xl bg-[#fffaf4] p-3 text-sm text-stone-700 sm:grid-cols-3">
                  <span>Pakiet: <strong>{getPlan(instance.planId).name}</strong></span>
                  <span>Storage: <strong>{instance.storageLimitGb} GB</strong></span>
                  <span>Wygasa: <strong>{new Date(instance.expiresAt).toLocaleDateString("pl-PL")}</strong></span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className={smallLinkClass} href={instance.publicPath}>Strona <ExternalLink className="size-3.5" /></Link>
                  <Link className={smallLinkClass} href={`${instance.adminPath}/panel`}>Panel <ExternalLink className="size-3.5" /></Link>
                  <select className="h-9 rounded-full border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700" value={instance.status} onChange={(event) => updateWeddingInstanceStatus(instance.id, event.target.value as WeddingInstanceStatus)}>
                    <option value="draft">Robocze</option>
                    <option value="payment_pending">Platnosc</option>
                    <option value="active">Aktywne</option>
                    <option value="paused">Pauza</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel title="Szybkie akcje">
          <div className="grid gap-3">
            <Action href="/oferta" title="Pokaz oferte" text="Cennik, funkcje i formularz leadow." />
            <Action href="/zamowienie" title="Utworz po zakupie" text="Nowa instancja i linki dla pary." />
            <Action href="/start" title="Kokpit" text="Jedno wejscie do calego produktu." />
            <div className="rounded-2xl bg-[#fffaf4] p-4 text-sm text-stone-700">
              <RefreshCcw className="mb-3 size-5 text-[#2f5d50]" />
              <p><strong>Platnosci oczekujace:</strong> {pendingInstances}</p>
              <p className="mt-1 text-stone-500">W produkcji status zmieni webhook platnosci.</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Leady z oferty">
        <div className="grid gap-3">
          {leads.length === 0 && <Empty text="Brak leadow. Formularz na /oferta zapisuje pierwsze zgloszenia lokalnie." />}
          {leads.map((lead) => (
            <article key={lead.id} className="grid gap-3 rounded-2xl border border-[#d8bd72]/20 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="font-semibold">{lead.name}</p>
                <p className="mt-1 text-sm text-stone-500">{lead.email} / {lead.phone || "bez telefonu"} / {lead.weddingDate || "brak daty"}</p>
                <p className="mt-2 text-sm text-stone-600">{lead.message || "Brak notatki."}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select className="h-9 rounded-full border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700" value={lead.status} onChange={(event) => setLeadStatus(lead.id, event.target.value as SalesLeadStatus)}>
                  <option value="new">Nowy</option>
                  <option value="contacted">Kontakt</option>
                  <option value="qualified">Kwalifikowany</option>
                  <option value="won">Wygrany</option>
                  <option value="lost">Utracony</option>
                </select>
                <Link className={smallLinkClass} href={`/zamowienie`}>Utworz wesele</Link>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl border border-[#d8bd72]/25 bg-white p-5 shadow-lg shadow-stone-900/5"><p className="text-sm text-stone-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>;
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#d8bd72]/25 bg-white/90 p-5 shadow-xl shadow-stone-900/5"><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{title}</h2>{action}</div>{children}</section>;
}

function Action({ href, title, text }: { href: string; title: string; text: string }) {
  return <Link href={href} className="rounded-2xl border border-[#d8bd72]/20 bg-white p-4 transition hover:border-[#2f5d50]"><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-stone-500">{text}</p></Link>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-stone-300 bg-white/70 p-6 text-sm text-stone-500">{text}</div>;
}

function StatusPill({ status }: { status: WeddingInstanceStatus }) {
  const danger = status === "payment_pending" || status === "paused";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${danger ? "bg-amber-50 text-amber-800" : "bg-[#e0f0eb] text-[#1f5f52]"}`}>{statusLabel[status]}</span>;
}

const statusLabel: Record<WeddingInstanceStatus, string> = {
  draft: "Robocze",
  payment_pending: "Platnosc",
  active: "Aktywne",
  paused: "Pauza",
};

const smallLinkClass = "inline-flex h-9 items-center gap-1.5 rounded-full border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-700 transition hover:bg-[#fff7ed]";
