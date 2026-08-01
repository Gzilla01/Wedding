import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/admin-auth";
import { createWeddingAdminDataForCouple } from "@/lib/admin-data";
import { getWeddingBySlug, jsonError, readWeddingAdminSnapshot, saveWeddingAdminSnapshot } from "@/lib/wedding-admin-server";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = verifyAdminSessionCookie((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
    if (!session || session.mustChangePassword) return jsonError("Brak dostepu.", 401);

    const { slug } = await params;
    const wedding = await getWeddingBySlug(slug);
    const fallback = createWeddingAdminDataForCouple({
      coupleNames: wedding.couple_names,
      weddingDate: wedding.wedding_date,
      phone: wedding.contact_phone ?? "",
      slug: wedding.slug,
    });
    const data = await readWeddingAdminSnapshot(slug, fallback);
    return Response.json({ ok: true, data });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Nie udalo sie pobrac danych wesela.", 500);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = verifyAdminSessionCookie((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
    if (!session || session.mustChangePassword) return jsonError("Brak dostepu.", 401);

    const { slug } = await params;
    const payload = await request.json();
    const data = await saveWeddingAdminSnapshot(slug, payload.data ?? payload);
    return Response.json({ ok: true, data });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Nie udalo sie zapisac danych wesela.", 500);
  }
}
