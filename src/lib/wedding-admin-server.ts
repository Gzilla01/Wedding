import { normalizeWeddingAdminData, type WeddingAdminData } from "@/lib/admin-data";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { normalizeWeddingSlug } from "@/lib/tenant";

export function requireAdminSupabase() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase service role is not configured");
  return supabase;
}

export async function getWeddingBySlug(slug: string) {
  const supabase = requireAdminSupabase();
  const normalizedSlug = normalizeWeddingSlug(slug);
  const { data, error } = await supabase
    .from("weddings")
    .select("id, slug, couple_names, wedding_date, contact_phone, contact_email, is_published")
    .eq("slug", normalizedSlug)
    .single();

  if (error || !data) throw new Error("Nie znaleziono wesela.");
  return data as {
    id: string;
    slug: string;
    couple_names: string;
    wedding_date: string;
    contact_phone: string | null;
    contact_email: string | null;
    is_published: boolean;
  };
}

export async function readWeddingAdminSnapshot(slug: string, fallbackData: WeddingAdminData) {
  const supabase = requireAdminSupabase();
  const wedding = await getWeddingBySlug(slug);
  const { data, error } = await supabase
    .from("wedding_admin_snapshots")
    .select("data")
    .eq("wedding_id", wedding.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return normalizeWeddingAdminData(data?.data ?? fallbackData);
}

export async function saveWeddingAdminSnapshot(slug: string, data: WeddingAdminData) {
  const supabase = requireAdminSupabase();
  const wedding = await getWeddingBySlug(slug);
  const normalized = normalizeWeddingAdminData(data);
  const { error } = await supabase
    .from("wedding_admin_snapshots")
    .upsert({
      wedding_id: wedding.id,
      data: normalized,
      updated_at: new Date().toISOString(),
    }, { onConflict: "wedding_id" });

  if (error) throw new Error(error.message);
  return normalized;
}

export function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}
