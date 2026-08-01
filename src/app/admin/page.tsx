import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionCookie } from "@/lib/admin-auth";
import { ADMIN_DATA_STORAGE_KEY, demoWeddingAdminData } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Panel | Aleksandra i Pawel 2028",
  description: "Panel administracyjny wesela Aleksandry i Pawla.",
};

const WEDDING_SLUG = "aleksandra-pawel-2028";

export default async function AdminPage() {
  const session = verifyAdminSessionCookie((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) redirect("/login");
  if (session.mustChangePassword) redirect("/login/change-password");

  return (
    <AdminPanel
      storageKey={`${ADMIN_DATA_STORAGE_KEY}:${WEDDING_SLUG}`}
      initialData={demoWeddingAdminData}
      remoteSlug={WEDDING_SLUG}
    />
  );
}
