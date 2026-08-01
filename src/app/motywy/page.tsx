import Link from "next/link";
import { ArrowRight, Palette } from "lucide-react";
import { demoThemes } from "@/lib/theme-presets";

export default function ThemesPage() {
  return (
    <main className="min-h-screen bg-[#fffaf4] px-5 py-10 text-stone-950 sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
          <p className="w-fit rounded-full border border-[#d8bd72]/35 bg-[#fff7ed] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2f7d6d]">Motywy demo</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-normal sm:text-6xl">Trzy gotowe style do rozmowy z para</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">Wybierasz motyw, pokazujesz demo i od razu masz kierunek wizualny do konfiguracji wesela.</p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {demoThemes.map((theme) => (
            <article key={theme.id} className="overflow-hidden rounded-3xl border border-[#d8bd72]/25 bg-white shadow-xl shadow-stone-900/5">
              <div className="p-5" style={{ background: theme.colors.background, color: theme.colors.text }}>
                <div className="rounded-3xl p-5 shadow-lg" style={{ background: theme.colors.surface }}>
                  <span className="grid size-11 place-items-center rounded-full" style={{ background: theme.colors.accent, color: theme.colors.primary }}><Palette className="size-5" /></span>
                  <h2 className="mt-5 text-2xl font-semibold">{theme.name}</h2>
                  <p className="mt-2 text-sm font-semibold" style={{ color: theme.colors.secondary }}>{theme.tagline}</p>
                  <div className="mt-5 grid grid-cols-5 gap-2">
                    {Object.values(theme.colors).slice(0, 5).map((color) => <span key={color} className="h-10 rounded-full border border-black/10" style={{ background: color }} />)}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-6 text-stone-600">{theme.description}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-stone-500">{theme.audience}</p>
                <ul className="mt-4 grid gap-2 text-sm text-stone-700">
                  {theme.details.map((detail) => <li key={detail}>- {detail}</li>)}
                </ul>
                <Link href={`/demo/${theme.id}`} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#2f5d50] px-4 text-sm font-semibold text-white">Otworz demo <ArrowRight className="size-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
