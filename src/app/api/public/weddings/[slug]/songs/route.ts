import { z } from "zod";
import { getWeddingBySlug, jsonError, requireAdminSupabase } from "@/lib/wedding-admin-server";

const songSchema = z.object({
  song: z.string().trim().min(2).max(180),
});

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const wedding = await getWeddingBySlug(slug);
    if (!wedding.is_published) return jsonError("To wesele nie jest jeszcze opublikowane.", 403);

    const supabase = requireAdminSupabase();
    const { data, error } = await supabase
      .from("song_requests")
      .select("id, title, votes, created_at")
      .eq("wedding_id", wedding.id)
      .order("votes", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true, songs: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udalo sie pobrac piosenek.";
    return jsonError(message, 400);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const wedding = await getWeddingBySlug(slug);
    if (!wedding.is_published) return jsonError("To wesele nie jest jeszcze opublikowane.", 403);

    const payload = songSchema.parse(await request.json());
    const supabase = requireAdminSupabase();
    const { data: existing } = await supabase
      .from("song_requests")
      .select("id, votes")
      .eq("wedding_id", wedding.id)
      .ilike("title", payload.song)
      .maybeSingle();

    const { data, error } = existing?.id
      ? await supabase.from("song_requests").update({ votes: Number(existing.votes ?? 0) + 1 }).eq("id", existing.id).select("id, title, votes").single()
      : await supabase.from("song_requests").insert({ wedding_id: wedding.id, title: payload.song, votes: 1 }).select("id, title, votes").single();

    if (error) return jsonError(error.message, 500);
    return Response.json({ ok: true, song: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udalo sie dodac piosenki.";
    return jsonError(message, 400);
  }
}
