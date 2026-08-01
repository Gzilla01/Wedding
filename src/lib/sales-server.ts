import { getPlan, type PlanId } from "@/lib/commercial-config";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { createTenantRoute, normalizeWeddingSlug } from "@/lib/tenant";
import type { CheckoutDraft, WeddingInstance } from "@/lib/sales-store";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  weddingDate?: string;
  source?: string;
  planId?: PlanId;
  message?: string;
  slug?: string;
};

export function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export function requireSupabaseAdmin() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase service role is not configured");
  return supabase;
}

export function validateLeadPayload(payload: LeadPayload) {
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim().toLowerCase() ?? "";
  if (name.length < 2) throw new Error("Podaj imiona lub nazwe kontaktu.");
  if (!email.includes("@")) throw new Error("Podaj poprawny email.");
  const planId = payload.planId ?? "live";
  const slug = normalizeWeddingSlug(payload.slug || name);
  return {
    couple_names: name,
    email,
    phone: payload.phone?.trim() ?? "",
    wedding_date: payload.weddingDate || null,
    source: payload.source?.trim() ?? "formularz",
    preferred_plan_id: planId,
    preferred_slug: slug,
    message: payload.message?.trim() ?? "",
    status: "new",
  };
}

export function validateCheckoutPayload(payload: CheckoutDraft) {
  const coupleNames = payload.coupleNames?.trim() ?? "";
  const ownerEmail = payload.ownerEmail?.trim().toLowerCase() ?? "";
  const weddingDate = payload.weddingDate || new Date().toISOString().slice(0, 10);
  if (coupleNames.length < 2) throw new Error("Podaj imiona pary.");
  if (!ownerEmail.includes("@")) throw new Error("Podaj poprawny email wlasciciela.");
  const route = createTenantRoute(payload.slug || coupleNames);
  const plan = getPlan(payload.planId ?? "live");
  const createdAt = new Date();
  const expiresAt = new Date(createdAt);
  expiresAt.setMonth(expiresAt.getMonth() + plan.weddingMonths);
  return {
    coupleNames,
    ownerEmail,
    phone: payload.phone?.trim() ?? "",
    weddingDate,
    plan,
    route,
    paymentMode: payload.paymentMode ?? "manual",
    createdAt,
    expiresAt,
  };
}

export function mapWeddingRowsToInstances(rows: Array<Record<string, unknown>>): WeddingInstance[] {
  return rows.map((row) => {
    const slug = String(row.slug ?? "");
    const route = createTenantRoute(slug);
    const planId = String(row.plan_id ?? "live") as PlanId;
    return {
      id: String(row.id),
      coupleNames: String(row.couple_names ?? ""),
      ownerEmail: String(row.owner_email ?? row.contact_email ?? ""),
      phone: String(row.contact_phone ?? ""),
      weddingDate: String(row.wedding_date ?? ""),
      planId,
      slug,
      status: Boolean(row.is_published) ? "active" : "payment_pending",
      publicPath: route.publicPath,
      adminPath: route.adminPath,
      storagePrefix: route.storagePrefix,
      storageLimitGb: Math.round(Number(row.storage_limit_mb ?? 0) / 1024),
      expiresAt: String(row.expires_at ?? new Date().toISOString()),
      createdAt: String(row.created_at ?? new Date().toISOString()),
    };
  });
}
