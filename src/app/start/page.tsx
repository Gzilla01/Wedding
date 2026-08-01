import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, CalendarHeart, LayoutDashboard, QrCode, ShoppingBag, Sparkles, UserRoundCog } from "lucide-react";

const links = [
  { href: "/oferta", title: "Oferta i cennik", text: "Strona do pokazywania klientom, pakiety i lead-capture.", icon: Sparkles },
  { href: "/materialy", title: "Materialy", text: "Motywy, QR do druku, PDF, maile i dokumenty prawne.", icon: QrCode },
  { href: "/motywy", title: "Motywy demo", text: "Trzy gotowe style do pokazania parze.", icon: Sparkles },
  { href: "/zamowienie", title: "Utworz instancje", text: "Flow po zakupie: dane pary, pakiet, slug i gotowe linki.", icon: ShoppingBag },
  { href: "/sprzedaz", title: "Panel sprzedazy", text: "Leady, utworzone wesela, statusy i szybkie linki.", icon: UserRoundCog },
  { href: "/", title: "Demo goscia", text: "Publiczny widok aplikacji dla gosci weselnych.", icon: CalendarHeart },
  { href: "/admin", title: "Demo admina", text: "Panel pary mlodej z edycja wesela, stolikow i planowania.", icon: LayoutDashboard },
  { href: "/w/anna-michal", title: "Przykladowy tenant", text: "Docelowy publiczny adres konkretnego wesela.", icon: QrCode },
];

export default function StartPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(194,164,93,0.22),transparent_28rem),linear-gradient(180deg,#fffaf4,#f8f5ef)] px-5 py-10 text-stone-950 sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-[#d8bd72]/25 bg-white/90 p-6 shadow-xl shadow-stone-900/5 md:p-8">
          <p className="w-fit rounded-full border border-[#d8bd72]/35 bg-[#fff7ed] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2f7d6d]">Kokpit produktu</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-normal sm:text-6xl">Nasze Wesele gotowe do obslugi sprzedazy</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">Tutaj masz jedno wejscie do oferty, kreatora nowego wesela, panelu sprzedazy i demo. Nie trzeba pamietac zadnych linkow.</p>
            </div>
            <div className="rounded-3xl bg-[#234d43] p-5 text-white">
              <Building2 className="size-7 text-[#d8bd72]" />
              <p className="mt-4 text-sm leading-6 text-white/78">Docelowo ten ekran moze byc ukryty za loginem superadmina i sluzyc do codziennej obslugi klientow.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="group rounded-3xl border border-[#d8bd72]/25 bg-white p-5 shadow-lg shadow-stone-900/5 transition hover:-translate-y-1 hover:border-[#2f5d50]">
              <span className="grid size-12 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50]"><item.icon className="size-5" /></span>
              <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">{item.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2f5d50]">Otworz <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-[#d8bd72]/25 bg-white p-6 shadow-lg shadow-stone-900/5">
          <div className="grid gap-4 md:grid-cols-3">
            <Trust title="Latwy dostep" text="Dolny pasek prowadzi do najwazniejszych miejsc z kazdej strony." />
            <Trust title="Automatyczny slug" text="Kreator po zakupie tworzy /w/[slug] i /app/[slug]." />
            <Trust title="Gotowe pod SaaS" text="Pakiety, limity, leady i instancje maja wspolny model danych." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Trust({ title, text }: { title: string; text: string }) {
  return <div className="flex gap-3"><BadgeCheck className="mt-0.5 size-5 shrink-0 text-[#2f7d6d]" /><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-stone-600">{text}</p></div></div>;
}
