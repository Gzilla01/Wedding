"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  ADMIN_DATA_STORAGE_KEY,
  demoWeddingAdminData,
  normalizeWeddingAdminData,
  type WeddingAdminData,
} from "@/lib/admin-data";

const CHANGE_EVENT = "nasze-wesele-data-change";
const cachedSnapshots = new Map<string, { raw: string | null; snapshot: WeddingAdminData }>();

function getSnapshot(storageKey: string, fallbackData: WeddingAdminData) {
  if (typeof window === "undefined") return fallbackData;
  try {
    const stored = window.localStorage.getItem(storageKey);
    const cached = cachedSnapshots.get(storageKey);
    if (!stored) {
      const snapshot = fallbackData;
      cachedSnapshots.set(storageKey, { raw: null, snapshot });
      return snapshot;
    }
    if (cached && stored === cached.raw) return cached.snapshot;
    const snapshot = normalizeWeddingAdminData(JSON.parse(stored));
    cachedSnapshots.set(storageKey, { raw: stored, snapshot });
    return snapshot;
  } catch {
    const snapshot = fallbackData;
    cachedSnapshots.set(storageKey, { raw: null, snapshot });
    return snapshot;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function useWeddingDataStore(storageKey = ADMIN_DATA_STORAGE_KEY, fallbackData = demoWeddingAdminData, options?: { remoteSlug?: string }) {
  const data = useSyncExternalStore(
    subscribe,
    () => getSnapshot(storageKey, fallbackData),
    () => fallbackData
  );
  const remoteSlug = options?.remoteSlug;

  useEffect(() => {
    if (!remoteSlug || typeof window === "undefined") return;
    let cancelled = false;
    fetch(`/api/admin/weddings/${encodeURIComponent(remoteSlug)}/data`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Nie udalo sie pobrac danych z serwera.")))
      .then((payload) => {
        if (cancelled || !payload?.data) return;
        const snapshot = normalizeWeddingAdminData(payload.data);
        const raw = JSON.stringify(snapshot);
        cachedSnapshots.set(storageKey, { raw, snapshot });
        window.localStorage.setItem(storageKey, raw);
        window.dispatchEvent(new Event(CHANGE_EVENT));
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [remoteSlug, storageKey]);

  function setData(next: WeddingAdminData | ((current: WeddingAdminData) => WeddingAdminData)) {
    if (typeof window === "undefined") return;
    const current = getSnapshot(storageKey, fallbackData);
    const value = typeof next === "function" ? next(current) : next;
    const raw = JSON.stringify(value);
    cachedSnapshots.set(storageKey, { raw, snapshot: value });
    window.localStorage.setItem(storageKey, raw);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    if (remoteSlug) {
      fetch(`/api/admin/weddings/${encodeURIComponent(remoteSlug)}/data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: value }),
      }).catch(() => undefined);
    }
  }

  return [data, setData] as const;
}
