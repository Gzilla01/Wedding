"use client";

import { ChevronRight, Heart } from "lucide-react";
import { Countdown } from "@/components/guest/countdown";
import { ADMIN_DATA_STORAGE_KEY, demoWeddingAdminData, type WeddingAdminData } from "@/lib/admin-data";
import { useWeddingDataStore } from "@/lib/wedding-data-store";

export function WeddingHero({ initialData = demoWeddingAdminData, remoteSlug }: { initialData?: WeddingAdminData; remoteSlug?: string }) {
  const [data] = useWeddingDataStore(remoteSlug ? `${ADMIN_DATA_STORAGE_KEY}:${remoteSlug}` : undefined, initialData, remoteSlug ? { remoteSlug } : undefined);

  const date = new Date(`${data.wedding.date}T${data.wedding.ceremonyTime}:00+02:00`);
  const displayDate = date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="max-w-2xl pb-10 text-white">
        <p className="hero-glow-line mb-4 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/18 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur">
          <Heart className="size-4" /> Nasze Wesele
        </p>
        <h1 className="font-display text-5xl leading-[0.98] tracking-normal drop-shadow-sm sm:text-7xl">
          {data.wedding.bride} i {data.wedding.groom}
        </h1>
        <div className="mt-5 flex items-center gap-3">
          <span className="h-px w-12 bg-[#d8bd72]" />
          <p className="text-xl font-medium text-white/95">{displayDate}</p>
          <span className="h-px w-12 bg-[#d8bd72]" />
        </div>
        <p className="mt-5 max-w-xl text-lg leading-8 text-white/90">{data.wedding.welcomeText}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a className="btn-primary" href="#harmonogram">
            Sprawdz plan dnia <ChevronRight className="size-5" />
          </a>
          <a className="btn-secondary" href="#miejsce">
            Znajdz swoje miejsce
          </a>
        </div>
      </div>
      <div className="pb-3">
        <Countdown targetDate={date.toISOString()} />
      </div>
    </>
  );
}
