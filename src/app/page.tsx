import Link from "next/link";
import { Baby, CalendarDays, Camera, Car, Gift, Heart, HelpCircle, Hotel, MapPin, Music2, Phone, ShieldCheck, Shirt, Sparkles, Utensils, Users } from "lucide-react";
import { AccessGate } from "@/components/guest/access-gate";
import { FriendlyGuestHub } from "@/components/guest/friendly-guest-hub";
import { GuestSearch } from "@/components/guest/guest-search";
import { WeddingHero } from "@/components/guest/wedding-hero";
import { SectionShell } from "@/components/section-shell";
import { demoWeddingAdminData, type WeddingAdminData } from "@/lib/admin-data";
import { readWeddingAdminSnapshot } from "@/lib/wedding-admin-server";

const WEDDING_SLUG = "aleksandra-pawel-2028";

const tiles = [
  { href: "#harmonogram", label: "Harmonogram", icon: CalendarDays },
  { href: "#miejsce", label: "Moje miejsce", icon: Users },
  { href: "/upload", label: "Dodaj zdjecia", icon: Camera },
  { href: "/gallery", label: "Galeria", icon: Sparkles },
  { href: "#lokalizacje", label: "Lokalizacje", icon: MapPin },
  { href: "#noclegi", label: "Nocleg", icon: Hotel },
  { href: "#faq", label: "FAQ", icon: HelpCircle },
  { href: "#kontakt", label: "Kontakt", icon: Phone },
];

export default async function Home() {
  const adminData = await loadWeddingData();
  const weddingDate = formatWeddingDate(adminData.wedding.date);
  const activeFaqItems = adminData.faqItems.filter((item) => item.active);

  return (
    <AccessGate initialData={adminData} remoteSlug={WEDDING_SLUG}>
      <main>
        <section className="relative min-h-[92svh] overflow-hidden bg-[#f8f1e8]">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(28,52,46,0.82),rgba(123,84,77,0.42)),url('/hero-wedding.svg')] bg-cover bg-center" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fffaf4] to-transparent" />
          <div className="absolute left-5 top-6 hidden rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur md:block">{weddingDate}</div>
          <div className="absolute right-8 top-10 hidden size-24 rounded-full border border-[#d8bd72]/45 md:block" />
          <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-end px-5 pb-8 pt-16 sm:px-8 lg:px-12">
            <WeddingHero initialData={adminData} remoteSlug={WEDDING_SLUG} />
          </div>
        </section>

        <FriendlyGuestHub />

        <SectionShell id="info" eyebrow="Najwazniejsze" title="Informacje organizacyjne">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard icon={CalendarDays} label="Data" value={weddingDate} />
            <InfoCard icon={CalendarDays} label="Ceremonia" value={`${adminData.wedding.ceremonyTime}, ${adminData.wedding.ceremonyAddress}`} />
            <InfoCard icon={MapPin} label="Przyjecie" value={adminData.wedding.venueAddress} />
            <InfoCard icon={Car} label="Transport" value={adminData.wedding.transportInfo || "Szczegoly transportu uzupelnimy blizej wesela."} />
          </div>
        </SectionShell>

        <SectionShell id="warto-wiedziec" eyebrow="Dobre praktyki" title="Warto wiedziec przed przyjazdem">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <WeddingRule icon={Shirt} title="Stroj" text="Elegancko i wygodnie do tanca. Bialy kolor zostawiamy pannie mlodej." />
            <WeddingRule icon={Camera} title="Zdjecia" text="Zdjecia z telefonu najlepiej dodac przez QR, zeby Aleksandra i Pawel mieli wszystko w jednym miejscu." />
            <WeddingRule icon={ShieldCheck} title="Social media" text="Mozna publikowac kadry z imprezy, ale prosimy bez transmisji ceremonii na zywo." />
            <WeddingRule icon={Baby} title="Dzieci" text="Dla najmniejszych gosci mozemy dopisac informacje o menu, noclegu i opiece." />
            <WeddingRule icon={Utensils} title="Diety" text="Alergie i diety beda widoczne w panelu oraz przy liscie gosci." />
            <WeddingRule icon={Gift} title="Prezenty" text="Najbardziej ciesza nas wspomnienia, zdjecia i wspolna obecnosc." />
          </div>
        </SectionShell>

        <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7b544d]">Dla gosci</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal">Wszystko, co moze sie przydac</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((tile) => (
              <Link href={tile.href} key={tile.label} className="group flex min-h-24 items-center gap-3 rounded-3xl border border-[#d8bd72]/18 bg-white p-3 shadow-lg shadow-stone-900/5 transition hover:-translate-y-1 hover:border-[#c2a45d] hover:shadow-xl">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50] transition group-hover:bg-[#2f5d50] group-hover:text-white">
                  <tile.icon className="size-5" />
                </span>
                <span className="text-left text-sm font-semibold leading-5">{tile.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <SectionShell id="jak-to-dziala" eyebrow="Bez stresu" title="Jak z tego korzystac">
          <div className="grid gap-4 md:grid-cols-3">
            <GuideStep number="1" title="Wpisz kod" text="Jesli strona jest prywatna, uzyj kodu z zaproszenia." />
            <GuideStep number="2" title="Sprawdz najwazniejsze" text="Plan dnia, lokalizacje i swoje miejsce masz pod reka." />
            <GuideStep number="3" title="Dodaj wspomnienia" text="Wrzucasz zdjecia lub krotkie wideo do galerii pary." />
          </div>
        </SectionShell>

        <SectionShell id="harmonogram" eyebrow="Plan dnia" title="Harmonogram wesela">
          <div className="relative space-y-4 before:absolute before:left-5 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[#d9c69a]">
            {adminData.schedule.map((item) => (
              <div className="relative flex gap-4" key={item.id}>
                <div className={`z-10 flex size-11 shrink-0 items-center justify-center rounded-full shadow-sm ${item.status === "confirmed" ? "bg-[#2f5d50] text-white" : "bg-white text-[#2f5d50] ring-1 ring-[#d9c69a]"}`}><CalendarDays className="size-5" /></div>
                <div className="wedding-card flex-1 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[#7b544d]">{item.time}</p><h3 className="text-lg font-semibold">{item.title}</h3></div>{item.status === "confirmed" && <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">Potwierdzone</span>}</div>
                  <p className="mt-2 text-stone-600">{item.place || item.owner || "Szczegoly do uzupelnienia."}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="miejsce" eyebrow="Usadzenie" title="Znajdz stolik i miejsce"><GuestSearch initialData={adminData} remoteSlug={WEDDING_SLUG} /></SectionShell>

        <SectionShell id="lokalizacje" eyebrow="Mapa" title="Lokalizacje i transport">
          <div className="grid gap-4 lg:grid-cols-2">
            <LocationCard name="Ceremonia" address={adminData.wedding.ceremonyAddress} description={`Start o ${adminData.wedding.ceremonyTime}.`} />
            <LocationCard name="Przyjecie" address={adminData.wedding.venueAddress} description={adminData.wedding.transportInfo || "Szczegoly dojazdu uzupelnimy blizej wesela."} />
          </div>
        </SectionShell>

        <SectionShell id="noclegi" eyebrow="Noclegi" title="Informacje dla nocujacych"><div className="wedding-card rounded-2xl p-6"><span className="mb-4 grid size-12 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50]"><Hotel className="size-6" /></span><h3 className="text-xl font-semibold">Noclegi</h3><p className="mt-2 text-stone-600">Informacje o pokojach i sniadaniu dopiszemy w panelu przy konkretnych gosciach.</p></div></SectionShell>

        <SectionShell id="dodatki" eyebrow="Dodatkowe" title="Zyczenia, muzyka i prezenty"><div className="grid gap-4 md:grid-cols-3"><Feature href="/guestbook" icon={Heart} title="Ksiega gosci" text="Zostaw zyczenia i krotka wiadomosc dla pary mlodej." /><Feature href="/music" icon={Music2} title="Ankieta muzyczna" text="Zaproponuj piosenke i zaglosuj na ulubione utwory." /><Feature href="#prezenty" icon={Gift} title="Prezenty" text="Najbardziej uciesza nas obecnosc, wspomnienia i wspolne zdjecia." /></div></SectionShell>

        <SectionShell id="faq" eyebrow="FAQ" title="Najczestsze pytania"><div className="wedding-card divide-y divide-stone-200/70 rounded-2xl">{activeFaqItems.map((item) => <details className="group p-5" key={item.id}><summary className="cursor-pointer list-none text-lg font-semibold">{item.question}</summary><p className="mt-2 text-stone-600">{item.answer}</p></details>)}</div></SectionShell>

        <SectionShell id="kontakt" eyebrow="Kontakt" title="W razie pytan"><a className="wedding-card block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-[#c2a45d]" href={`tel:${adminData.wedding.contactPhone}`}><p className="text-sm text-stone-500">Kontakt organizacyjny</p><p className="text-lg font-semibold">Aleksandra i Pawel</p><p className="mt-1 text-[#2f5d50]">{adminData.wedding.contactPhone}</p></a></SectionShell>
      </main>
    </AccessGate>
  );
}

async function loadWeddingData(): Promise<WeddingAdminData> {
  try {
    return await readWeddingAdminSnapshot(WEDDING_SLUG, demoWeddingAdminData);
  } catch {
    return demoWeddingAdminData;
  }
}

function formatWeddingDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <article className="wedding-card rounded-2xl p-5"><span className="mb-4 grid size-11 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50]"><Icon className="size-5" /></span><p className="text-sm font-semibold uppercase tracking-wide text-stone-500">{label}</p><p className="mt-2 text-lg font-medium leading-7">{value}</p></article>;
}

function WeddingRule({ icon: Icon, title, text }: { icon: typeof Shirt; title: string; text: string }) {
  return (
    <article className="wedding-card-soft group rounded-2xl p-5">
      <span className="soft-pulse grid size-11 place-items-center rounded-full bg-white text-[#2f5d50] shadow-sm ring-1 ring-[#d8bd72]/20">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </article>
  );
}

function GuideStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-[#d8bd72]/22 bg-white p-5 shadow-lg shadow-stone-900/5">
      <span className="grid size-12 place-items-center rounded-full bg-[#234d43] text-lg font-bold text-white">{number}</span>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </article>
  );
}

function LocationCard({ name, address, description }: { name: string; address: string; description: string }) {
  return (
    <article className="wedding-card rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50]"><MapPin className="size-5" /></span>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-stone-600">{address}</p>
          <p className="mt-2 text-sm text-stone-500">{description}</p>
          <a className="btn-small mt-4" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">Google Maps</a>
        </div>
      </div>
    </article>
  );
}

function Feature({ href, icon: Icon, title, text }: { href: string; icon: typeof Heart; title: string; text: string }) {
  return <Link className="wedding-card rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[#c2a45d] hover:shadow-xl" href={href}><span className="mb-4 grid size-12 place-items-center rounded-full bg-[#fff1f0] text-[#7b544d]"><Icon className="size-6" /></span><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></Link>;
}
