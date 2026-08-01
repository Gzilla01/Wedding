import { z } from "zod";
import { getWeddingBySlug, jsonError, requireAdminSupabase } from "@/lib/wedding-admin-server";

const guestbookSchema = z.object({
  name: z.string().trim().min(2).max(100),
  message: z.string().trim().min(2).max(2000),
});

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const wedding = await getWeddingBySlug(slug);
    if (!wedding.is_published) return jsonError("To wesele nie jest jeszcze opublikowane.", 403);

    const payload = guestbookSchema.parse(await request.json());
    const supabase = requireAdminSupabase();
    const { error } = await supabase.from("guestbook_entries").insert({
      wedding_id: wedding.id,
      author_name: payload.name,
      message: payload.message,
      is_approved: false,
    });

    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udalo sie dodac wpisu.";
    return jsonError(message, 400);
  }
}
