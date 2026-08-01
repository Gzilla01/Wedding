import Link from "next/link";
import { ArrowRight, CalendarHeart, LockKeyhole, Palette, Users } from "lucide-react";
import { createTenantRoute } from "@/lib/tenant";

export default async function TenantAdminEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = createTenantRoute(slug);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(194,164,93,0.2),transparent_28rem),linear-gradient(180deg,#fffaf4,#f8f5ef)] px-5 py-10 text-stone-950 sm:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl place-items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="w-fit rounded-full border border-[#d8bd72]/35 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#2f7d6d]">Panel pary mlodej</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-normal sm:text-6xl">{humanizeSlug(route.slug)}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              To jest miejsce do spokojnego ustawienia strony weselnej: danych, gosci, stolikow, QR, galerii i planu dnia.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/app/${route.slug}/panel`} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white">Otworz panel pary <ArrowRight className="size-4" /></Link>
              <Link href={route.publicPath} className="inline-flex h-12 items-center gap-2 rounded-full border border-[#2f5d50]/25 bg-white px-5 text-sm font-semibold text-[#234d43]">Strona gosci</Link>
            </div>
          </div>
          <div className="rounded-3xl border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5">
            <LockKeyhole className="size-8 text-[#2f5d50]" />
            <h2 className="mt-4 text-2xl font-semibold">Co ustawisz w panelu</h2>
            <div className="mt-5 grid gap-3">
              <Item icon={CalendarHeart} text="Plan dnia, lokalizacje i komunikaty dla gosci." />
              <Item icon={Users} text="Liste gosci, RSVP, stoliki i mape sali." />
              <Item icon={Palette} text="Motyw, kolory, QR, galerie i zdjecia." />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Item({ icon: Icon, text }: { icon: typeof CalendarHeart; text: string }) {
  return <div className="flex gap-3 rounded-2xl bg-[#fffaf4] p-4"><Icon className="mt-0.5 size-5 shrink-0 text-[#2f5d50]" /><p className="text-sm leading-6 text-stone-700">{text}</p></div>;
}

function humanizeSlug(slug: string) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" i ");
}
