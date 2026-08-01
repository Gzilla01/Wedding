"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, QrCode, Sparkles, UserRoundCog } from "lucide-react";

const navItems = [
  { href: "/start", label: "Operator", icon: LayoutDashboard },
  { href: "/sprzedaz", label: "Wesela", icon: UserRoundCog },
  { href: "/materialy", label: "Materialy", icon: Sparkles },
  { href: "/materialy/qr", label: "QR", icon: QrCode },
];

const visiblePrefixes = ["/start", "/zamowienie", "/sprzedaz", "/materialy", "/admin"];

export function ProductNav() {
  const pathname = usePathname();
  const visible = visiblePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-full border border-[#d8bd72]/30 bg-white/92 p-1.5 shadow-2xl shadow-stone-900/15 backdrop-blur print:hidden">
      <nav className="grid grid-cols-4 gap-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-semibold text-stone-600 transition hover:bg-[#fff7ed] hover:text-[#2f5d50] sm:flex-row sm:gap-2 sm:text-sm">
            <item.icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
