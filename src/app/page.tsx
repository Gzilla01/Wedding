import Link from "next/link";
import { Baby, CalendarDays, Camera, Car, Gift, Heart, HelpCircle, Hotel, MapPin, Music2, Phone, ShieldCheck, Shirt, Sparkles, Utensils, Users } from "lucide-react";
import { AccessGate } from "@/components/guest/access-gate";
import { FriendlyGuestHub } from "@/components/guest/friendly-guest-hub";
import { GuestSearch } from "@/components/guest/guest-search";
import { WeddingDayMode } from "@/components/guest/wedding-day-mode";
import { WeddingHero } from "@/components/guest/wedding-hero";
import { SectionShell } from "@/components/section-shell";
import { announcements, contacts, faqItems, locations, menuItems, photoChallenges, scheduleItems, transports, wedding } from "@/lib/demo-data";

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

export default function Home() {
  return (
    <AccessGate>
      <main>
      <section className="relative min-h-[92svh] overflow-hidden bg-[#f8f1e8]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(28,52,46,0.82),rgba(123,84,77,0.42)),url('/hero-wedding.svg')] bg-cover bg-center" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fffaf4] to-transparent" />
        <div className="absolute left-5 top-6 hidden rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur md:block">20 czerwca 2026</div>
        <div className="absolute right-8 top-10 hidden size-24 rounded-full border border-[#d8bd72]/45 md:block" />
        <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-end px-5 pb-8 pt-16 sm:px-8 lg:px-12">
          <WeddingHero />
        </div>
      </section>

      <FriendlyGuestHub />
      <WeddingDayMode />

      <SectionShell id="info" eyebrow="Najwazniejsze" title="Informacje organizacyjne">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={CalendarDays} label="Data" value={wedding.displayDate} />
          <InfoCard icon={CalendarDays} label="Ceremonia" value={`${wedding.ceremonyTime}, ${wedding.ceremonyAddress}`} />
          <InfoCard icon={MapPin} label="Przyjecie" value={wedding.venueAddress} />
          <InfoCard icon={Car} label="Transport" value="Autobusy powrotne o 02:00 i 04:00 spod glownego wejscia." />
        </div>
      </SectionShell>

      <SectionShell id="warto-wiedziec" eyebrow="Dobre praktyki" title="Warto wiedziec przed przyjazdem">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <WeddingRule icon={Shirt} title="Stroj" text="Elegancko i wygodnie do tanca. Bialy kolor zostawiamy pannie mlodej." />
          <WeddingRule icon={Camera} title="Zdjecia" text="Zdjecia z telefonu najlepiej dodac przez QR, zeby para miala wszystko w jednym miejscu." />
          <WeddingRule icon={ShieldCheck} title="Social media" text="Mozna publikowac kadry z imprezy, ale prosimy bez transmisji ceremonii na zywo." />
          <WeddingRule icon={Baby} title="Dzieci" text="Dla najmniejszych gosci jest kacik dzieci i prostsze menu. W razie potrzeby zadzwon do kontaktu." />
          <WeddingRule icon={Utensils} title="Diety" text="Alergie i diety sa przekazane sali. Swoje oznaczenia znajdziesz przy wyszukiwaniu miejsca." />
          <WeddingRule icon={Gift} title="Prezenty" text="Najbardziej ciesza nas wspomnienia, zdjecia i wspolna obecnosc. Szczegoly sa nizej na stronie." />
        </div>
      </SectionShell>

      <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7b544d]">Pozostale informacje</p>
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

      <SectionShell id="aktualnosci" eyebrow="Komunikaty" title="Aktualnosci dla gosci">
        <div className="grid gap-3 md:grid-cols-3">{announcements.map((item) => <article className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm" key={item.id}><Sparkles className="mb-3 size-5 text-[#c2a45d]" /><p className="text-sm font-semibold text-amber-900">{item.title}</p><p className="mt-1 text-stone-700">{item.body}</p></article>)}</div>
      </SectionShell>

      <SectionShell id="jak-to-dziala" eyebrow="Bez stresu" title="Jak z tego korzystac">
        <div className="grid gap-4 md:grid-cols-3">
          <GuideStep number="1" title="Zeskanuj QR" text="Otwierasz strone w telefonie. Niczego nie instalujesz." />
          <GuideStep number="2" title="Sprawdz najwazniejsze" text="Plan dnia, lokalizacje i swoje miejsce masz pod reka." />
          <GuideStep number="3" title="Dodaj wspomnienia" text="Wrzucasz zdjecia lub krotkie wideo do galerii pary." />
        </div>
      </SectionShell>

      <SectionShell id="harmonogram" eyebrow="Plan dnia" title="Harmonogram wesela">
        <div className="relative space-y-4 before:absolute before:left-5 before:top-3 before:h-[calc(100%-1.5rem)] before:w-px before:bg-[#d9c69a]">
          {scheduleItems.map((item) => (
            <div className="relative flex gap-4" key={item.id}>
              <div className={`z-10 flex size-11 shrink-0 items-center justify-center rounded-full shadow-sm ${item.highlighted ? "bg-[#2f5d50] text-white" : "bg-white text-[#2f5d50] ring-1 ring-[#d9c69a]"}`}><item.icon className="size-5" /></div>
              <div className="wedding-card flex-1 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[#7b544d]">{item.time}</p><h3 className="text-lg font-semibold">{item.title}</h3></div>{item.highlighted && <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">Wazne</span>}</div>
                <p className="mt-2 text-stone-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="miejsce" eyebrow="Usadzenie" title="Znajdz stolik i miejsce"><GuestSearch /></SectionShell>

      <SectionShell id="lokalizacje" eyebrow="Mapa" title="Lokalizacje i transport">
        <div className="grid gap-4 lg:grid-cols-2">{locations.map((location) => <article className="wedding-card rounded-2xl p-5" key={location.id}><div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50]"><MapPin className="size-5" /></span><div><h3 className="text-lg font-semibold">{location.name}</h3><p className="text-stone-600">{location.address}</p><p className="mt-2 text-sm text-stone-500">{location.description}</p><div className="mt-4 flex flex-wrap gap-2"><a className="btn-small" href={location.googleMapsUrl} target="_blank" rel="noreferrer">Google Maps</a><a className="btn-small-outline" href={location.navigationUrl} target="_blank" rel="noreferrer">Nawigacja</a></div></div></div></article>)}</div>
        <div className="wedding-card mt-5 rounded-2xl p-5"><h3 className="mb-3 text-lg font-semibold">Transport</h3><div className="grid gap-3 md:grid-cols-2">{transports.map((transport) => <div className="rounded-2xl bg-[#f8efe3] p-4" key={transport.id}><p className="font-semibold">{transport.route}</p><p className="text-sm text-stone-600">{transport.time} | {transport.seats} miejsc</p><p className="mt-1 text-sm text-stone-500">Kontakt: {transport.contact}</p></div>)}</div></div>
      </SectionShell>

      <SectionShell id="noclegi" eyebrow="Noclegi" title="Informacje dla nocujacych"><div className="wedding-card rounded-2xl p-6"><span className="mb-4 grid size-12 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50]"><Hotel className="size-6" /></span><h3 className="text-xl font-semibold">Dworek Pod Lipami</h3><p className="mt-2 text-stone-600">Zameldowanie od 13:00. Sniadanie 09:00-11:00 w oranzerii. Numer pokoju jest widoczny po wyszukaniu swojego miejsca.</p></div></SectionShell>

      <SectionShell id="menu" eyebrow="Menu" title="Menu weselne"><div className="grid gap-3 md:grid-cols-2">{menuItems.map((item) => <article className="wedding-card-soft rounded-2xl p-5" key={item.id}><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-white text-[#2f5d50] shadow-sm"><Utensils className="size-5" /></span><h3 className="font-semibold">{item.name}</h3></div><p className="mt-3 text-sm text-stone-600">{item.description}</p><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#7b544d]">{item.tags.join(" | ")}</p></article>)}</div></SectionShell>

      <SectionShell id="foto-zadania" eyebrow="Zabawa" title="Zadania foto dla gosci">
        <div className="grid gap-3 md:grid-cols-4">
          {photoChallenges.map((challenge) => (
            <article className="wedding-card-soft rounded-2xl p-5" key={challenge.id}>
              <Camera className="mb-4 size-6 text-[#2f5d50]" />
              <h3 className="font-semibold">{challenge.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{challenge.description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="dodatki" eyebrow="Dodatkowe" title="Zyczenia, muzyka i prezenty"><div className="grid gap-4 md:grid-cols-3"><Feature href="/guestbook" icon={Heart} title="Ksiega gosci" text="Zostaw zyczenia i krotka wiadomosc dla pary mlodej." /><Feature href="/music" icon={Music2} title="Ankieta muzyczna" text="Zaproponuj piosenke i zaglosuj na ulubione utwory." /><Feature href="#prezenty" icon={Gift} title="Prezenty" text="Najbardziej uciesza nas koperty, wino zamiast kwiatow i wspolne zdjecia." /></div></SectionShell>

      <SectionShell id="faq" eyebrow="FAQ" title="Najczestsze pytania"><div className="wedding-card divide-y divide-stone-200/70 rounded-2xl">{faqItems.map((item) => <details className="group p-5" key={item.id}><summary className="cursor-pointer list-none text-lg font-semibold">{item.question}</summary><p className="mt-2 text-stone-600">{item.answer}</p></details>)}</div></SectionShell>

      <SectionShell id="kontakt" eyebrow="Kontakt" title="W razie pytan"><div className="grid gap-3 md:grid-cols-2">{contacts.map((contact) => <a className="wedding-card rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-[#c2a45d]" href={`tel:${contact.phone}`} key={contact.name}><p className="text-sm text-stone-500">{contact.role}</p><p className="text-lg font-semibold">{contact.name}</p><p className="mt-1 text-[#2f5d50]">{contact.phone}</p></a>)}</div></SectionShell>
      </main>
    </AccessGate>
  );
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

function Feature({ href, icon: Icon, title, text }: { href: string; icon: typeof Heart; title: string; text: string }) {
  return <Link className="wedding-card rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[#c2a45d] hover:shadow-xl" href={href}><span className="mb-4 grid size-12 place-items-center rounded-full bg-[#fff1f0] text-[#7b544d]"><Icon className="size-6" /></span><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></Link>;
}
