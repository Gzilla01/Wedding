import { jsonError, requireSupabaseAdmin, validateLeadPayload } from "@/lib/sales-server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const lead = validateLeadPayload(payload);
    const supabase = requireSupabaseAdmin();
    const { data, error } = await supabase.from("sales_leads").insert(lead).select("*").single();
    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true, lead: data });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Nie udalo sie zapisac leada.", 400);
  }
}
