import Link from "next/link";
import { ArrowRight, FileText, Mail, Palette, QrCode, ShieldCheck } from "lucide-react";

const materials = [
  { href: "/motywy", title: "3 motywy demo", text: "Editorial Gold, Botanical Green i Modern White.", icon: Palette },
  { href: "/materialy/qr", title: "QR do druku", text: "Karty A4/stolikowe z QR do strony, galerii i uploadu.", icon: QrCode },
  { href: "/oferta", title: "Oferta dla par", text: "Pakiety, ceny i formularz zgloszenia.", icon: FileText },
  { href: "/start", title: "Kokpit produktu", text: "Szybki dostep do wszystkich ekranow sprzedazowych.", icon: ArrowRight },
];

export default function MaterialsPage() {
  return (
    <main className="min-h-screen bg-[#fffaf4] px-5 py-10 text-stone-950 sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
          <p className="w-fit rounded-full border border-[#d8bd72]/35 bg-[#fff7ed] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2f7d6d]">Materialy sprzedazowe</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-normal sm:text-6xl">Pakiet do rozmowy z para</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">Motywy, QR, oferta, dokumenty i onboarding w jednym miejscu.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {materials.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-3xl border border-[#d8bd72]/25 bg-white p-5 shadow-lg shadow-stone-900/5 transition hover:-translate-y-1 hover:border-[#2f5d50]">
              <item.icon className="size-6 text-[#2f5d50]" />
              <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Info icon={Mail} title="Onboarding mailowy" text="Szablony maili sa w docs/onboarding-emails.md." />
          <Info icon={ShieldCheck} title="Dokumenty prawne" text="Szablony regulaminu, prywatnosci, zgody i retencji sa w docs/legal." />
        </div>
      </section>
    </main>
  );
}

function Info({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) {
  return <div className="rounded-3xl border border-[#d8bd72]/25 bg-white p-5 shadow-lg shadow-stone-900/5"><Icon className="size-6 text-[#2f5d50]" /><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></div>;
}
