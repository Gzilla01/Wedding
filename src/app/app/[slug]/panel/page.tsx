import type { Metadata } from "next";
import { TenantAdminPanel } from "@/components/admin/TenantAdminPanel";

export const metadata: Metadata = {
  title: "Panel pary | Nasze Wesele",
  description: "Panel konfiguracji konkretnej instancji wesela.",
};

export default async function TenantAdminPanelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TenantAdminPanel slug={slug} />;
}
