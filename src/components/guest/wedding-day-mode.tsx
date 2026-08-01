"use client";

import Link from "next/link";
import { Camera, Clock3, MapPin, Phone, Search, Sparkles } from "lucide-react";
import { scheduleItems, transports, wedding } from "@/lib/demo-data";

export function WeddingDayMode() {
  const now = new Date();
  const weddingDate = new Date(wedding.date);
  const isBeforeWedding = now < weddingDate;
  const currentItem = scheduleItems[0];
  const nextItem = scheduleItems[1];
  const nextTransport = transports[0];

  return (
    <section className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:px-12">
      <div className="overflow-hidden rounded-[2rem] border border-[#d8bd72]/25 bg-white shadow-xl shadow-stone-900/8">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="bg-[#234d43] p-5 text-white sm:p-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
              <Sparkles className="size-4 text-[#d8bd72]" /> Tryb dnia wesela
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal">Najwazniejsze pod reka</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">
              {isBeforeWedding
                ? "Przed weselem sprawdzisz plan, miejsce przy stoliku, dojazd i dodasz swoje muzyczne propozycje."
                : "W dniu wesela tu widac aktualny punkt programu, kolejny krok, zdjecia, transport i kontakt."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MomentCard label={isBeforeWedding ? "Start uroczystosci" : "Teraz"} title={`${currentItem.time} - ${currentItem.title}`} text={currentItem.description} />
              <MomentCard label="Nastepnie" title={`${nextItem.time} - ${nextItem.title}`} text={nextItem.description} />
            </div>
          </div>
          <div className="grid gap-3 bg-[#fffaf4] p-5 sm:p-6">
            <QuickLink href="#miejsce" icon={Search} title="Znajdz swoje miejsce" text="Wpisz imie lub nazwisko, wybierz osobe i zobacz stolik." />
            <QuickLink href="/upload" icon={Camera} title="Dodaj zdjecia" text="Kilka klikniec z telefonu, bez logowania i bez instalacji." />
            <QuickLink href="#lokalizacje" icon={MapPin} title="Dojazd i transport" text={`${nextTransport.route}, ${nextTransport.time}. Nawigacja jest pod lista lokalizacji.`} />
            <a href="tel:+48500100200" className="flex items-center gap-3 rounded-2xl border border-[#d8bd72]/22 bg-white p-4 shadow-sm transition hover:-translate-y-0.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e0f0eb] text-[#2f5d50]"><Phone className="size-5" /></span>
              <span>
                <span className="block font-semibold">Kontakt w razie problemu</span>
                <span className="text-sm leading-5 text-stone-600">+48 500 100 200</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function MomentCard({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#d8bd72]"><Clock3 className="size-4" /> {label}</p>
      <p className="mt-2 font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-5 text-white/72">{text}</p>
    </div>
  );
}

function QuickLink({ href, icon: Icon, title, text }: { href: string; icon: typeof Search; title: string; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-[#d8bd72]/22 bg-white p-4 shadow-sm transition hover:-translate-y-0.5">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e0f0eb] text-[#2f5d50]"><Icon className="size-5" /></span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="text-sm leading-5 text-stone-600">{text}</span>
      </span>
    </Link>
  );
}
