import Link from "next/link";
import { CalendarDays, Camera, MapPin, Music2, QrCode, Users } from "lucide-react";
import { getDemoTheme } from "@/lib/theme-presets";

const quickTiles = [
  { label: "Plan dnia", icon: CalendarDays },
  { label: "Moje miejsce", icon: Users },
  { label: "Dodaj zdjecia", icon: Camera },
  { label: "Lokalizacje", icon: MapPin },
];

const featureTiles = [
  { title: "QR bez aplikacji", text: "Gosc skanuje kod i od razu widzi swoje informacje.", icon: QrCode },
  { title: "Galeria live", text: "Zdjecia trafiaja do moderowanej galerii i pokazu slajdow.", icon: Camera },
  { title: "Ankieta muzyczna", text: "Goscie dodaja piosenki, para ma gotowa liste dla DJ-a.", icon: Music2 },
];

export default async function ThemeDemoPage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme: themeId } = await params;
  const theme = getDemoTheme(themeId);

  return (
    <main style={{ background: theme.colors.background, color: theme.colors.text }} className="min-h-screen">
      <section className="mx-auto grid min-h-[88svh] max-w-7xl items-end gap-8 px-5 pb-10 pt-20 sm:px-8 lg:grid-cols-[1fr_420px] lg:px-12">
        <div>
          <p className="w-fit rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ background: theme.colors.surface, color: theme.colors.primary }}>Demo motywu</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-normal sm:text-7xl">{theme.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8" style={{ color: theme.colors.secondary }}>{theme.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/motywy" className="inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold text-white" style={{ background: theme.colors.primary }}>Wroc do motywow</Link>
            <Link href="/zamowienie" className="inline-flex h-12 items-center rounded-full border px-5 text-sm font-semibold" style={{ borderColor: theme.colors.accent, color: theme.colors.primary }}>Utworz wesele</Link>
          </div>
        </div>
        <div className="rounded-[2rem] p-5 shadow-2xl shadow-stone-900/10" style={{ background: theme.colors.surface }}>
          <div className="aspect-[4/5] rounded-[1.5rem] p-5" style={{ background: theme.colors.primary, color: "#fff" }}>
            <p className="text-sm uppercase tracking-[0.18em] opacity-75">Anna i Michal</p>
            <h2 className="mt-3 text-4xl font-semibold">20 czerwca 2026</h2>
            <p className="mt-4 text-sm leading-6 opacity-80">Witamy na naszej stronie. Tu znajdziesz plan dnia, swoje miejsce i galerie zdjec.</p>
            <div className="mt-8 grid gap-3">
              {quickTiles.map((tile) => (
                <div key={tile.label} className="flex items-center gap-3 rounded-2xl bg-white/12 p-3">
                  <tile.icon className="size-5" />
                  <span className="font-semibold">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-12">
        {featureTiles.map((tile) => (
          <article key={tile.title} className="rounded-3xl p-5 shadow-lg shadow-stone-900/5" style={{ background: theme.colors.surface }}>
            <tile.icon className="size-6" style={{ color: theme.colors.primary }} />
            <h2 className="mt-4 text-xl font-semibold">{tile.title}</h2>
            <p className="mt-2 text-sm leading-6" style={{ color: theme.colors.secondary }}>{tile.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
