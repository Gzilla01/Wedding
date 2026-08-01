"use client";

import { getPlan, type PlanId } from "@/lib/commercial-config";
import { createTenantRoute, normalizeWeddingSlug } from "@/lib/tenant";

export const SALES_LEADS_STORAGE_KEY = "nasze-wesele-sales-leads";
export const WEDDING_INSTANCES_STORAGE_KEY = "nasze-wesele-instances";

export type SalesLeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export type SalesLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  source: string;
  planId: PlanId;
  message: string;
  slug: string;
  status: SalesLeadStatus;
  createdAt: string;
};

export type WeddingInstanceStatus = "draft" | "payment_pending" | "active" | "paused";

export type WeddingInstance = {
  id: string;
  coupleNames: string;
  ownerEmail: string;
  phone: string;
  weddingDate: string;
  planId: PlanId;
  slug: string;
  status: WeddingInstanceStatus;
  publicPath: string;
  adminPath: string;
  storagePrefix: string;
  storageLimitGb: number;
  expiresAt: string;
  createdAt: string;
};

export type CheckoutDraft = {
  coupleNames: string;
  ownerEmail: string;
  phone: string;
  weddingDate: string;
  planId: PlanId;
  slug: string;
  paymentMode: "manual" | "paid";
};

export function createSalesId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readSalesLeads() {
  return readLocalArray<SalesLead>(SALES_LEADS_STORAGE_KEY);
}

export function saveSalesLeads(leads: SalesLead[]) {
  writeLocalArray(SALES_LEADS_STORAGE_KEY, leads.slice(0, 100));
}

export function upsertSalesLead(lead: SalesLead) {
  const current = readSalesLeads();
  saveSalesLeads([lead, ...current.filter((item) => item.id !== lead.id)]);
}

export function readWeddingInstances() {
  return readLocalArray<WeddingInstance>(WEDDING_INSTANCES_STORAGE_KEY);
}

export function saveWeddingInstances(instances: WeddingInstance[]) {
  writeLocalArray(WEDDING_INSTANCES_STORAGE_KEY, instances.slice(0, 100));
}

export function createWeddingInstance(draft: CheckoutDraft): WeddingInstance {
  const route = createTenantRoute(draft.slug || draft.coupleNames);
  const plan = getPlan(draft.planId);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt);
  expiresAt.setMonth(expiresAt.getMonth() + plan.weddingMonths);

  const instance: WeddingInstance = {
    id: createSalesId("wedding"),
    coupleNames: draft.coupleNames.trim(),
    ownerEmail: draft.ownerEmail.trim(),
    phone: draft.phone.trim(),
    weddingDate: draft.weddingDate,
    planId: draft.planId,
    slug: normalizeWeddingSlug(route.slug),
    status: draft.paymentMode === "paid" ? "active" : "payment_pending",
    publicPath: route.publicPath,
    adminPath: route.adminPath,
    storagePrefix: route.storagePrefix,
    storageLimitGb: plan.storageGb,
    expiresAt: expiresAt.toISOString(),
    createdAt: createdAt.toISOString(),
  };

  saveWeddingInstances([instance, ...readWeddingInstances().filter((item) => item.slug !== instance.slug)]);
  return instance;
}

export function updateWeddingInstanceStatus(id: string, status: WeddingInstanceStatus) {
  saveWeddingInstances(readWeddingInstances().map((instance) => (instance.id === id ? { ...instance, status } : instance)));
}

function readLocalArray<T>(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

function writeLocalArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(`${key}:change`));
}
