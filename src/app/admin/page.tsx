import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ADMIN_DATA_STORAGE_KEY, demoWeddingAdminData } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Panel | Aleksandra i Pawel 2028",
  description: "Panel administracyjny wesela Aleksandry i Pawla.",
};

const WEDDING_SLUG = "aleksandra-pawel-2028";

export default function AdminPage() {
  return (
    <AdminPanel
      storageKey={`${ADMIN_DATA_STORAGE_KEY}:${WEDDING_SLUG}`}
      initialData={demoWeddingAdminData}
      remoteSlug={WEDDING_SLUG}
    />
  );
}
