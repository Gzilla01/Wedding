"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CalendarDays, Settings } from "lucide-react";
import { WEDDING_INSTANCES_STORAGE_KEY, readWeddingInstances } from "@/lib/sales-store";

const emptyInstances: ReturnType<typeof readWeddingInstances> = [];
let cachedInstancesRaw = "";
let cachedInstances = emptyInstances;

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener(`${WEDDING_INSTANCES_STORAGE_KEY}:change`, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(`${WEDDING_INSTANCES_STORAGE_KEY}:change`, callback);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return emptyInstances;
  const raw = window.localStorage.getItem(WEDDING_INSTANCES_STORAGE_KEY) ?? "[]";
  if (raw === cachedInstancesRaw) return cachedInstances;
  cachedInstancesRaw = raw;
  cachedInstances = readWeddingInstances();
  return cachedInstances;
}

export function TenantInstancePreview({ slug }: { slug: string }) {
  const instances = useSyncExternalStore(subscribe, getSnapshot, () => emptyInstances);
  const instance = instances.find((item) => item.slug === slug);

  if (!instance) return null;

  return (
    <div className="mt-8 rounded-3xl border border-white/20 bg-white/12 p-5 text-white backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Strona wesela</p>
      <h2 className="mt-2 text-2xl font-semibold">{instance.coupleNames}</h2>
      <p className="mt-4 flex gap-2 text-sm text-white/78"><CalendarDays className="size-4 text-[#d8bd72]" />{instance.weddingDate || "Data zostanie uzupelniona wkrotce"}</p>
      <Link href={instance.adminPath} className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#234d43]">
        Panel pary <Settings className="size-4" />
      </Link>
    </div>
  );
}
