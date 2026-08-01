import Link from "next/link";
import { CalendarDays, Camera, CheckCircle2, HelpCircle, MapPin, MessageSquareText, Navigation, Search, Users } from "lucide-react";
import { GuestSearch } from "@/components/guest/guest-search";
import { createWeddingAdminDataForCouple, demoWeddingAdminData } from "@/lib/admin-data";
import { createTenantRoute } from "@/lib/tenant";
import { faqItems, wedding } from "@/lib/demo-data";
import { getWeddingBySlug, readWeddingAdminSnapshot } from "@/lib/wedding-admin-server";

const guestActions = [
  { href: "#plan", title: "Plan dnia", text: "Co, gdzie i o ktorej.", icon: CalendarDays, tone: "bg-[#e0f0eb] text-[#173f36]" },
  { href: "#miejsce", title: "Gdzie siedze?", text: "Znajdz stolik i miejsce.", icon: Search, tone: "bg-[#fff7df] text-[#574519]" },
  { href: "/rsvp", title: "RSVP", text: "Potwierdz obecnosc.", icon: CheckCircle2, tone: "bg-[#eef2ff] text-[#25345f]" },
  { href: "/upload", title: "Dodaj zdjecia", text: "Wrzuc fotki z telefonu.", icon: Camera, tone: "bg-[#fff1f0] text-[#5f3338]" },
  { href: "#lokalizacja", title: "Lokalizacja", text: "Nawigacja i transport.", icon: MapPin, tone: "bg-[#f0fdf4] text-[#1f5135]" },
  { href: "#faq", title: "FAQ", text: "Najczestsze pytania.", icon: HelpCircle, tone: "bg-white text-stone-800 ring-1 ring-[#d8bd72]/30" },
];

export default async function PublicWeddingTenantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = createTenantRoute(slug);
  const adminData = await loadPublicWeddingData(route.slug);
  const coupleName = `${adminData.wedding.bride} i ${adminData.wedding.groom}`;
  const activeFaqItems = adminData.faqItems.filter((item) => item.active);
  const ceremonyAddress = adminData.wedding.ceremonyAddress || wedding.ceremonyAddress;
  const venueAddress = adminData.wedding.venueAddress || wedding.venueAddress;

  return (
    <main className="min-h-screen bg-[#fffaf4] text-stone-950">
      <section className="relative overflow-hidden bg-[#234d43] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(20,48,41,0.96),rgba(79,59,54,0.76)),url('/hero-wedding.svg')] bg-cover bg-center" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-5xl flex-col justify-end px-4 pb-6 pt-16 sm:px-6">
          <p className="w-fit rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur">Strona goscia</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-normal sm:text-6xl">{coupleName}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
            Wszystko pod reka: plan dnia, stolik, RSVP, zdjecia, dojazd i odpowiedzi na najczestsze pytania.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 text-sm sm:flex sm:flex-wrap">
            <InfoPill icon={CalendarDays} label={formatWeddingDate(adminData.wedding.date)} />
            <InfoPill icon={MapPin} label={venueAddress} />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-4 pb-4 sm:px-6">
        <div className="rounded-[1.5rem] border border-[#d8bd72]/25 bg-white p-3 shadow-2xl shadow-stone-900/12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {guestActions.map((action) => (
              <Link key={action.title} href={tenantHref(action.href, route.slug)} className={`flex min-h-32 flex-col justify-between rounded-2xl p-4 transition active:scale-[0.98] hover:-translate-y-0.5 ${action.tone}`}>
                <span className="grid size-10 place-items-center rounded-full bg-white/78 shadow-sm">
                  <action.icon className="size-5" />
                </span>
                <span>
                  <span className="block text-base font-bold leading-5">{action.title}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-75">{action.text}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="miejsce" className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <div className="rounded-[1.5rem] border border-[#d8bd72]/25 bg-white p-5 shadow-lg shadow-stone-900/5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e0f0eb] text-[#2f5d50]"><Users className="size-5" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Stolik</p>
              <h2 className="text-2xl font-semibold">Znajdz swoje miejsce</h2>
              <p className="mt-1 text-sm leading-6 text-stone-600">Wpisz imie lub nazwisko. Pokazemy tylko informacje potrzebne gosciowi.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input className="field" placeholder="Np. Maria Kowalska" />
            <button className="btn-primary" type="button"><Search className="size-5" /> Szukaj</button>
          </div>
          <div className="mt-5"><GuestSearch initialData={adminData} remoteSlug={route.slug} /></div>
        </div>
      </section>

      <section id="plan" className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <SectionTitle kicker="Plan dnia" title="Najwazniejsze momenty" />
        <div className="mt-4 grid gap-3">
          {adminData.schedule.slice(0, 8).map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#d8bd72]/20 bg-white p-4 shadow-sm">
              <div className="flex gap-3">
                <span className={`grid size-11 shrink-0 place-items-center rounded-full ${item.status === "confirmed" ? "bg-[#2f5d50] text-white" : "bg-[#eef5f1] text-[#2f5d50]"}`}><CalendarDays className="size-5" /></span>
                <div>
                  <p className="text-sm font-bold text-[#7b544d]">{item.time}</p>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{item.place || item.owner || "Szczegoly w trakcie uzupelniania."}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="lokalizacja" className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <SectionTitle kicker="Dojazd" title="Lokalizacje" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            { id: "ceremony", name: "Ceremonia", address: ceremonyAddress, description: `Start o ${adminData.wedding.ceremonyTime}.`, navigationUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ceremonyAddress)}` },
            { id: "venue", name: "Przyjecie", address: venueAddress, description: adminData.wedding.transportInfo || "Szczegoly dojazdu i transportu uzupelnia para mloda.", navigationUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}` },
          ].map((location) => (
            <article key={location.id} className="rounded-2xl border border-[#d8bd72]/20 bg-white p-4 shadow-sm">
              <MapPin className="size-5 text-[#2f5d50]" />
              <h3 className="mt-3 text-lg font-semibold">{location.name}</h3>
              <p className="mt-1 text-sm text-stone-600">{location.address}</p>
              <p className="mt-2 text-sm leading-6 text-stone-500">{location.description}</p>
              <a className="btn-small mt-4" href={location.navigationUrl} target="_blank" rel="noreferrer"><Navigation className="size-4" /> Nawiguj</a>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-5xl px-4 py-5 pb-24 sm:px-6">
        <SectionTitle kicker="FAQ" title="Szybkie odpowiedzi" />
        <div className="mt-4 divide-y divide-stone-200 overflow-hidden rounded-2xl border border-[#d8bd72]/20 bg-white shadow-sm">
          {(activeFaqItems.length ? activeFaqItems : faqItems).map((item) => (
            <details key={item.id} className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                {item.question}
                <MessageSquareText className="size-4 shrink-0 text-[#2f5d50]" />
              </summary>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 md:hidden">
        <Link href="#miejsce" className="flex h-13 items-center justify-center gap-2 rounded-full bg-[#2f5d50] px-4 text-sm font-bold text-white shadow-2xl shadow-stone-900/20">
          <Search className="size-4" /> Stolik
        </Link>
        <Link href={`/upload?w=${route.slug}`} className="flex h-13 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-[#2f5d50] shadow-2xl shadow-stone-900/15 ring-1 ring-[#d8bd72]/30">
          <Camera className="size-4" /> Zdjecia
        </Link>
      </div>
    </main>
  );
}

function InfoPill({ icon: Icon, label }: { icon: typeof CalendarDays; label: string }) {
  return <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/12 px-3 text-left text-white/88 ring-1 ring-white/18 backdrop-blur"><Icon className="size-4 shrink-0 text-[#d8bd72]" /> {label}</span>;
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b544d]">{kicker}</p><h2 className="mt-1 text-2xl font-semibold">{title}</h2></div>;
}

function humanizeSlug(slug: string) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" i ");
}

function tenantHref(href: string, slug: string) {
  if (href.startsWith("#")) return href;
  return `${href}?w=${slug}`;
}

async function loadPublicWeddingData(slug: string) {
  try {
    const weddingRecord = await getWeddingBySlug(slug);
    const fallback = createWeddingAdminDataForCouple({
      coupleNames: weddingRecord.couple_names,
      weddingDate: weddingRecord.wedding_date,
      phone: weddingRecord.contact_phone ?? "",
      slug,
    });
    return await readWeddingAdminSnapshot(slug, fallback);
  } catch {
    return createWeddingAdminDataForCouple({
      coupleNames: humanizeSlug(slug),
      weddingDate: demoWeddingAdminData.wedding.date,
      slug,
    });
  }
}

function formatWeddingDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return wedding.displayDate;
  return parsed.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}
