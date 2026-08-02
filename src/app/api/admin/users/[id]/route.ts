import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = verifyAdminSessionCookie((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || session.mustChangePassword) return Response.json({ error: "Brak dostepu." }, { status: 401 });

  const { id } = await params;
  if (session.userId === id) return Response.json({ error: "Nie mozesz usunac konta, na ktorym jestes zalogowany." }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase service role is not configured." }, { status: 503 });

  const { data: currentUser, error: readError } = await supabase.auth.admin.getUserById(id);
  if (readError || !currentUser.user) return Response.json({ error: readError?.message || "Nie znaleziono konta." }, { status: 404 });
  if (currentUser.user.app_metadata?.role !== "superadmin") return Response.json({ error: "Konto nie ma roli superadmina." }, { status: 403 });

  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return Response.json({ error: error.message }, { status: 400 });

  return Response.json({ ok: true, id });
}
