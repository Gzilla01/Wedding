import { jsonError, mapWeddingRowsToInstances, requireSupabaseAdmin } from "@/lib/sales-server";

export async function GET() {
  try {
    const supabase = requireSupabaseAdmin();
    const { data, error } = await supabase
      .from("weddings")
      .select("id, slug, couple_names, wedding_date, contact_email, owner_email, contact_phone, is_published, plan_id, storage_limit_mb, expires_at, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true, instances: mapWeddingRowsToInstances(data ?? []) });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Nie udalo sie pobrac instancji.", 400);
  }
}
