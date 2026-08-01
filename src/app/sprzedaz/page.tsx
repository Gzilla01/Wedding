import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { SalesDashboard } from "@/components/sales/sales-dashboard";

export default function SalesPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(194,164,93,0.22),transparent_28rem),linear-gradient(180deg,#fffaf4,#f8f5ef)] px-5 py-10 text-stone-950 sm:px-8">
      <section className="mx-auto max-w-7xl">
        <Link href="/start" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f5d50]"><ArrowLeft className="size-4" /> Kokpit</Link>
        <div className="mt-6 rounded-[2rem] border border-[#d8bd72]/25 bg-white/90 p-6 shadow-xl shadow-stone-900/5 md:p-8">
          <p className="w-fit rounded-full border border-[#d8bd72]/35 bg-[#fff7ed] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2f7d6d]">Panel operatorski</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-normal sm:text-6xl">Sprzedaz i obsluga instancji</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">Jedno miejsce do sprawdzania leadow, utworzonych wesel, statusow platnosci i linkow dla klientow.</p>
            </div>
            <div className="rounded-3xl bg-[#234d43] p-5 text-white">
              <LockKeyhole className="size-7 text-[#d8bd72]" />
              <p className="mt-4 text-sm leading-6 text-white/78">W produkcji ta strona powinna byc dostepna tylko dla superadmina.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <SalesDashboard />
        </div>
      </section>
    </main>
  );
}
