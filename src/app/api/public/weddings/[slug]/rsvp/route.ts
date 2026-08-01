import { z } from "zod";
import { getWeddingBySlug, jsonError, requireAdminSupabase } from "@/lib/wedding-admin-server";

const rsvpSchema = z.object({
  name: z.string().trim().min(3).max(120),
  attending: z.enum(["yes", "no"]),
  companion: z.string().trim().max(120).optional(),
  diet: z.string().trim().max(240).optional(),
  allergies: z.string().trim().max(240).optional(),
  accommodation: z.boolean().optional(),
  transport: z.boolean().optional(),
  message: z.string().trim().max(800).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const wedding = await getWeddingBySlug(slug);
    if (!wedding.is_published) return jsonError("To wesele nie jest jeszcze opublikowane.", 403);

    const payload = rsvpSchema.parse(await request.json());
    const supabase = requireAdminSupabase();
    const [firstName = "", ...lastNameParts] = payload.name.replace(/\s+/g, " ").split(" ");
    const lastName = lastNameParts.join(" ") || "-";
    const rsvpStatus = payload.attending === "yes" ? "accepted" : "declined";
    const dietaryNotes = [payload.diet, payload.allergies].filter(Boolean).join(" | ");

    const { data: existingGuest } = await supabase
      .from("guests")
      .select("id")
      .eq("wedding_id", wedding.id)
      .ilike("display_name", payload.name)
      .maybeSingle();

    const guestRecord = {
      wedding_id: wedding.id,
      first_name: firstName,
      last_name: lastName,
      rsvp_status: rsvpStatus,
      meal_preference: payload.diet || null,
      dietary_notes: dietaryNotes || null,
      message_to_couple: payload.message || null,
    };

    const { data: guest, error } = existingGuest?.id
      ? await supabase.from("guests").update(guestRecord).eq("id", existingGuest.id).select("id").single()
      : await supabase.from("guests").insert(guestRecord).select("id").single();

    if (error) return jsonError(error.message, 500);

    if (payload.companion && payload.attending === "yes") {
      const [companionFirstName = "", ...companionLastNameParts] = payload.companion.replace(/\s+/g, " ").split(" ");
      await supabase.from("guests").insert({
        wedding_id: wedding.id,
        first_name: companionFirstName,
        last_name: companionLastNameParts.join(" ") || "-",
        is_plus_one: true,
        rsvp_status: "accepted",
      });
    }

    return Response.json({ ok: true, guestId: guest?.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udalo sie zapisac RSVP.";
    return jsonError(message, 400);
  }
}
