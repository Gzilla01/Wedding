import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrintableQrKit } from "@/components/sales/printable-qr-kit";

export default function PrintableQrPage() {
  return (
    <main className="min-h-screen bg-[#fffaf4] px-5 py-10 text-stone-950 sm:px-8 print:bg-white print:px-0 print:py-0">
      <section className="mx-auto max-w-7xl print:max-w-none">
        <Link href="/materialy" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2f5d50] print:hidden"><ArrowLeft className="size-4" /> Materialy</Link>
        <div className="mt-6 rounded-[2rem] border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8 print:hidden">
          <p className="w-fit rounded-full border border-[#d8bd72]/35 bg-[#fff7ed] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2f7d6d]">QR do druku</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-normal sm:text-6xl">Gotowe karty QR</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">Drukuj jako A4, tnij na mniejsze karty albo pobierz pojedyncze kody PNG.</p>
        </div>
        <div className="mt-6 print:mt-0">
          <PrintableQrKit />
        </div>
      </section>
    </main>
  );
}
