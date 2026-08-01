import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/admin-auth";

export async function GET() {
  const session = verifyAdminSessionCookie((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return Response.json({ user: null }, { status: 401 });
  return Response.json({ user: { email: session.email, name: session.name, role: session.role } });
}
