"use client";

import { useMemo, useSyncExternalStore } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { ADMIN_DATA_STORAGE_KEY, createWeddingAdminDataForCouple } from "@/lib/admin-data";
import { WEDDING_INSTANCES_STORAGE_KEY, readWeddingInstances, type WeddingInstance } from "@/lib/sales-store";

const emptyInstances: WeddingInstance[] = [];
let cachedInstancesRaw: string | null = null;
let cachedInstancesSnapshot: WeddingInstance[] = emptyInstances;

function subscribeInstances(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener(`${WEDDING_INSTANCES_STORAGE_KEY}:change`, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(`${WEDDING_INSTANCES_STORAGE_KEY}:change`, callback);
  };
}

function getInstancesSnapshot() {
  if (typeof window === "undefined") return emptyInstances;
  const raw = window.localStorage.getItem(WEDDING_INSTANCES_STORAGE_KEY) ?? "[]";
  if (raw === cachedInstancesRaw) return cachedInstancesSnapshot;
  cachedInstancesRaw = raw;
  cachedInstancesSnapshot = readWeddingInstances();
  return cachedInstancesSnapshot;
}

export function TenantAdminPanel({ slug }: { slug: string }) {
  const instances = useSyncExternalStore(subscribeInstances, getInstancesSnapshot, () => emptyInstances);
  const instance = instances.find((item) => item.slug === slug);
  const initialData = useMemo(
    () => createWeddingAdminDataForCouple({
      coupleNames: instance?.coupleNames ?? humanizeSlug(slug),
      weddingDate: instance?.weddingDate,
      phone: instance?.phone,
      slug,
    }),
    [instance?.coupleNames, instance?.phone, instance?.weddingDate, slug]
  );

  return <AdminPanel storageKey={`${ADMIN_DATA_STORAGE_KEY}:${slug}`} initialData={initialData} remoteSlug={slug} />;
}

function humanizeSlug(slug: string) {
  return slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" i ");
}
