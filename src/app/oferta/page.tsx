import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarHeart, Camera, Check, HeartHandshake, LockKeyhole, Mail, MessageCircle, QrCode, ShieldCheck, Smartphone, Sparkles, Table2, Users } from "lucide-react";
import { LeadForm } from "@/components/sales/lead-form";
import { commercialPlans } from "@/lib/commercial-config";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kontakt@naszewesele.pl";

const modules = [
  { title: "Strona dla gosci", text: "Najwazniejsze informacje, harmonogram, lokalizacje, FAQ i kontakt w jednym miejscu.", icon: CalendarHeart },
  { title: "QR bez instalacji", text: "Gosc skanuje kod i korzysta z aplikacji w przegladarce telefonu.", icon: QrCode },
  { title: "Plan stolow", text: "Wyszukiwarka miejsca, lista osob przy stoliku i czytelna mapa sali.", icon: Table2 },
  { title: "Galeria live", text: "Zdjecia i krotkie filmy od gosci, moderacja i pokaz slajdow.", icon: Camera },
  { title: "Panel pary", text: "Edycja tresci, gosci, stolikow, komunikatow, QR i organizacji wesela.", icon: Users },
  { title: "Organizacja", text: "Checklisty, uslugodawcy, zaliczki, dokumenty i zalaczniki.", icon: BadgeCheck },
];

const cooperationSteps = [
  "Umawiamy krotka rozmowe i dobieramy zakres.",
  "Przygotowujemy strone, motyw, dane wesela i QR.",
  "Para akceptuje wersje przed publikacja.",
  "W dniu wesela goscie korzystaja z aplikacji po zeskanowaniu kodu.",
];

const outcomes = [
  { title: "Dla pary", text: "Mniej pytan na Messengerze, gotowe QR, spokojny panel z gosciami, stolikami i zdjeciami." },
  { title: "Dla gosci", text: "Jeden skan, plan dnia, swoje miejsce, nawigacja, kontakt i dodawanie zdjec z telefonu." },
  { title: "Dla wedding plannera", text: "Szybsza kontrola brakow: stoliki, noclegi, transport, diety, dokumenty i platnosci." },
];

const safety = [
  "Dostep do panelu tylko dla uprawnionych osob.",
  "Mozliwosc moderacji zdjec przed publikacja.",
  "Limity uploadu i kontrola materialow od gosci.",
  "Szablony zgod, retencji i polityki prywatnosci do konsultacji prawnej.",
];

export default function OfferPage() {
  return (
    <main className="bg-[#fffaf4] text-stone-950">
      <section className="relative min-h-[92svh] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(27,55,48,0.92),rgba(83,57,54,0.50)),url('/hero-wedding.svg')] bg-cover bg-center" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fffaf4] to-transparent" />
        <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-5 pb-12 pt-20 sm:px-8 lg:px-12">
          <p className="w-fit rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur">Nasze Wesele</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[1.03] tracking-normal text-white sm:text-6xl lg:text-7xl">Elegancka aplikacja weselna dla pary i gosci</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">
            Jedno miejsce na plan dnia, lokalizacje, usadzenie gosci, galerie zdjec, RSVP, QR i spokojna organizacje wesela.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`mailto:${contactEmail}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#234d43] shadow-xl shadow-black/10">Zapytaj o oferte <Mail className="size-4" /></a>
            <Link href="/demo" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/35 px-5 text-sm font-semibold text-white backdrop-blur">Zobacz demo</Link>
            <Link href="/motywy" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/35 px-5 text-sm font-semibold text-white backdrop-blur">Motywy demo</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-4 md:grid-cols-3">
          <Promise title="Bez chaosu" text="Goscie nie pisza i nie dzwonia o podstawowe informacje, bo wszystko maja pod QR." />
          <Promise title="Bez instalacji" text="Aplikacja dziala w przegladarce telefonu. Native app nie jest wymagana na start." />
          <Promise title="Z pomoca" text="Wdrozenie mozemy przygotowac razem z para, sala albo wedding plannerem." />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <div className="rounded-[2rem] border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Efekt wdrozenia</p>
          <h2 className="mt-2 max-w-3xl text-4xl font-semibold tracking-normal">To nie jest kolejna strona z zaproszeniem, tylko centrum wesela</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {outcomes.map((item) => (
              <article key={item.title} className="rounded-3xl bg-[#fffaf4] p-5">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Co zawiera</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-normal">Wszystko, czego goscie szukaja w dniu wesela</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <article key={module.title} className="rounded-3xl border border-[#d8bd72]/25 bg-white p-5 shadow-lg shadow-stone-900/5">
              <span className="grid size-11 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50]"><module.icon className="size-5" /></span>
              <h3 className="mt-5 text-xl font-semibold">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_440px] lg:px-12">
        <div className="rounded-[2rem] border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Aplikacja mobilna</p>
          <h2 className="mt-2 text-3xl font-semibold">Czy potrzebna jest aplikacja w App Store?</h2>
          <p className="mt-4 leading-7 text-stone-600">
            Na start nie. Najlepsze doswiadczenie dla gosci to szybka aplikacja webowa/PWA: bez instalacji, bez konta i bez czekania. Gosc skanuje QR, otwiera strone i od razu dziala. Native app mozna rozwazyc pozniej, jesli pojawi sie potrzeba powiadomien push, pracy offline albo duzych wdrozen B2B.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Mini icon={Smartphone} title="Telefon" text="Projekt mobile-first." />
            <Mini icon={QrCode} title="QR" text="Najmniej tarcia dla gosci." />
            <Mini icon={Sparkles} title="PWA" text="Mozliwosc instalacji jako ikonka." />
          </div>
        </div>
        <div className="rounded-[2rem] bg-[#234d43] p-6 text-white shadow-xl shadow-stone-900/10">
          <LockKeyhole className="size-8 text-[#d8bd72]" />
          <h2 className="mt-4 text-3xl font-semibold">Bezpieczenstwo i prywatnosc</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-white/78">
            {safety.map((item) => <li key={item} className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#d8bd72]" />{item}</li>)}
          </ul>
        </div>
      </section>

      <section id="pakiety" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Zakresy wspolpracy</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-normal">Pakiety jako punkt wyjscia do oferty</h2>
          <p className="mt-3 leading-7 text-stone-600">Najpierw kontaktujemy sie, dobieramy zakres i przygotowujemy propozycje dla konkretnego wesela.</p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {commercialPlans.map((plan) => (
            <article key={plan.id} className={`relative rounded-3xl border bg-white p-5 shadow-lg shadow-stone-900/5 ${plan.recommended ? "border-[#2f5d50] ring-2 ring-[#2f5d50]/15" : "border-[#d8bd72]/25"}`}>
              {plan.recommended && <span className="absolute right-4 top-4 rounded-full bg-[#2f5d50] px-3 py-1 text-xs font-bold text-white">Polecany</span>}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-stone-600">{plan.tagline}</p>
              <p className="mt-5 text-sm font-bold uppercase tracking-wide text-[#2f7d6d]">Wycena po kontakcie</p>
              <ul className="mt-5 grid gap-2 text-sm text-stone-700">
                {plan.features.map((feature) => <li key={feature} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#2f7d6d]" />{feature}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_420px] lg:px-12">
        <div className="rounded-3xl border border-[#d8bd72]/25 bg-white p-6 shadow-xl shadow-stone-900/5">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2f7d6d]">Jak zaczynamy</p>
          <h2 className="mt-2 text-3xl font-semibold">Prosty proces bez presji</h2>
          <div className="mt-6 grid gap-3">
            {cooperationSteps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl bg-[#fffaf4] p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#2f5d50] text-sm font-bold text-white">{index + 1}</span>
                <p className="self-center text-sm leading-6 text-stone-700">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[#e0f0eb] p-4 text-sm leading-6 text-[#1f5f52]">
            Napisz na <strong>{contactEmail}</strong> albo zostaw kontakt w formularzu. Odezwiemy sie z propozycja zakresu.
          </div>
        </div>
        <LeadForm />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12">
        <div className="rounded-3xl bg-[#234d43] p-6 text-white shadow-xl shadow-stone-900/10 md:flex md:items-center md:justify-between">
          <div>
            <MessageCircle className="mb-3 size-6 text-[#d8bd72]" />
            <h2 className="text-2xl font-semibold">Chcesz zobaczyc, jak to wyglada dla Twojego wesela?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">Przygotujemy demo, dobierzemy motyw i powiemy, jak najlepiej ustawic QR, galerie i plan stolow.</p>
          </div>
          <a href={`mailto:${contactEmail}`} className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#234d43] md:mt-0">Napisz do nas <ArrowRight className="size-4" /></a>
        </div>
      </section>
    </main>
  );
}

function Promise({ title, text }: { title: string; text: string }) {
  return <article className="rounded-3xl border border-[#d8bd72]/25 bg-white p-5 shadow-lg shadow-stone-900/5"><HeartHandshake className="size-6 text-[#2f5d50]" /><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></article>;
}

function Mini({ icon: Icon, title, text }: { icon: typeof Smartphone; title: string; text: string }) {
  return <div className="rounded-2xl border border-[#d8bd72]/20 p-4"><Icon className="size-5 text-[#2f7d6d]" /><p className="mt-3 font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-stone-500">{text}</p></div>;
}
