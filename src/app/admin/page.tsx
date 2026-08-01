import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "Admin | Nasze Wesele",
  description: "Panel administracyjny dla danych wesela.",
};

export default function AdminPage() {
  return <AdminPanel />;
}
