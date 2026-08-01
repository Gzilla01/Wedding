import Link from "next/link";
import { ArrowRight, Camera, CheckCircle2, Palette, QrCode, Search, Smartphone } from "lucide-react";
import { demoThemes } from "@/lib/theme-presets";

const demoSteps = [
  { title: "1. Gosc skanuje QR", text: "Bez instalacji, bez konta, od razu w telefonie.", icon: QrCode },
  { title: "2. Sprawdza najwazniejsze", text: "Plan dnia, miejsce przy stoliku, dojazd i kontakt.", icon: Search },
  { title: "3. Dodaje wspomnienia", text: "Zdjecia i krotkie filmy trafiaja do galerii pary.", icon: Camera },
];

export default function DemoIndexPage() {
  return (
    <main className="min-h-screen bg-[#fffaf4] text-stone-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(27,55,48,0.92),rgba(123,84,77,0.48)),url('/hero-wedding.svg')] bg-cover bg-center" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fffaf4] to-transparent" />
        <div className="relative mx-auto flex min-h-[82svh] max-w-7xl flex-col justify-end px-5 pb-12 pt-20 sm:px-8 lg:px-12">
          <p className="w-fit rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur">Demo dla par</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[1.03] tracking-normal text-white sm:text-7xl">Zobacz, jak moze wygladac aplikacja weselna</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/84">Ta sciezka pokazuje doswiadczenie goscia, przykladowe motywy i gotowe materialy QR do druku.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#234d43]">Demo goscia <Smartphone className="size-4" /></Link>
            <Link href="/materialy/qr" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/35 px-5 text-sm font-semibold text-white backdrop-blur">QR do druku</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          {demoSteps.map((step) => (
            <article key={step.title} className="rounded-3xl border border-[#d8bd72]/25 bg-white p-5 shadow-lg shadow-stone-900/5">
              <span className="grid size-11 place-items-center rounded-full bg-[#e0f0eb] text-[#2f5d50]"><step.icon className="size-5" /></span>
              <h2 className="mt-5 text-xl font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <div className="mb-6 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Motywy</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-normal">Trzy style gotowe do rozmowy</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {demoThemes.map((theme) => (
            <article key={theme.id} className="overflow-hidden rounded-3xl border border-[#d8bd72]/25 bg-white shadow-xl shadow-stone-900/5">
              <div className="p-5" style={{ background: theme.colors.background, color: theme.colors.text }}>
                <div className="rounded-3xl p-5" style={{ background: theme.colors.surface }}>
                  <Palette className="size-6" style={{ color: theme.colors.primary }} />
                  <h3 className="mt-5 text-2xl font-semibold">{theme.name}</h3>
                  <p className="mt-2 text-sm" style={{ color: theme.colors.secondary }}>{theme.tagline}</p>
                  <div className="mt-5 grid grid-cols-5 gap-2">
                    {Object.values(theme.colors).slice(0, 5).map((color) => <span key={color} className="h-10 rounded-full border border-black/10" style={{ background: color }} />)}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-stone-600">{theme.description}</p>
                <ul className="mt-4 grid gap-2 text-sm text-stone-700">
                  {theme.details.slice(0, 3).map((detail) => <li key={detail} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2f7d6d]" />{detail}</li>)}
                </ul>
                <Link href={`/demo/${theme.id}`} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#2f5d50] px-4 text-sm font-semibold text-white">Otworz motyw <ArrowRight className="size-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
