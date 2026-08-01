import Link from "next/link";
import { ArrowRight, Camera, Clock3, MapPin, Navigation, Search, Sparkles, Users } from "lucide-react";

const primaryActions = [
  { href: "#miejsce", title: "Znajdz miejsce", text: "Wpisz imie i zobacz stolik.", icon: Search, tone: "green" },
  { href: "/upload", title: "Dodaj zdjecia", text: "Wrzuc fotki i krotkie wideo.", icon: Camera, tone: "rose" },
  { href: "#harmonogram", title: "Plan dnia", text: "Sprawdz, co jest teraz.", icon: Clock3, tone: "gold" },
  { href: "#lokalizacje", title: "Nawigacja", text: "Kosciol, sala i parking.", icon: Navigation, tone: "cream" },
];

const steps = [
  { title: "Teraz", text: "Ceremonia o 14:00 w Kosciele sw. Anny.", icon: Sparkles },
  { title: "Potem", text: "Przejazd na sale i powitanie o 16:00.", icon: MapPin },
  { title: "Przez caly wieczor", text: "Dodawaj zdjecia do wspolnej galerii.", icon: Camera },
];

export function FriendlyGuestHub() {
  return (
    <>
      <section className="mx-auto -mt-10 max-w-6xl px-5 pb-6 sm:px-8 lg:px-12">
        <div className="friendly-enter relative z-20 overflow-hidden rounded-[2rem] border border-[#d8bd72]/25 bg-white p-4 shadow-2xl shadow-stone-900/12 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-stretch">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e0f0eb] text-[#2f5d50]"><Users className="size-5" /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Weselny asystent</p>
                  <h2 className="text-2xl font-semibold tracking-normal">Co chcesz zrobic?</h2>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {primaryActions.map((action) => (
                  <Link key={action.title} href={action.href} className={`group flex min-h-36 flex-col justify-between rounded-3xl p-4 text-left shadow-sm transition active:scale-[0.98] ${toneClass(action.tone)}`}>
                    <span className="grid size-11 place-items-center rounded-full bg-white/80 text-[#2f5d50] shadow-sm"><action.icon className="size-5" /></span>
                    <span>
                      <span className="block text-base font-semibold">{action.title}</span>
                      <span className="mt-1 block text-xs leading-5 opacity-75">{action.text}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-[#234d43] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Najwazniejsze</p>
              <div className="mt-4 grid gap-3">
                {steps.map((step) => (
                  <div key={step.title} className="flex gap-3 rounded-2xl bg-white/10 p-3">
                    <step.icon className="mt-0.5 size-5 shrink-0 text-[#d8bd72]" />
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm leading-5 text-white/72">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 md:hidden">
        <Link href="#miejsce" className="flex h-13 items-center justify-center gap-2 rounded-full bg-[#2f5d50] px-4 text-sm font-bold text-white shadow-2xl shadow-stone-900/20">
          <Search className="size-4" /> Miejsce
        </Link>
        <Link href="/upload" className="flex h-13 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-[#2f5d50] shadow-2xl shadow-stone-900/15 ring-1 ring-[#d8bd72]/30">
          Zdjecia <ArrowRight className="size-4" />
        </Link>
      </div>
    </>
  );
}

function toneClass(tone: string) {
  if (tone === "green") return "bg-[#e0f0eb] text-[#183f36]";
  if (tone === "rose") return "bg-[#fff1f0] text-[#5b3438]";
  if (tone === "gold") return "bg-[#fff7df] text-[#5a4618]";
  return "bg-[#fffaf4] text-stone-800 ring-1 ring-[#d8bd72]/20";
}
