"use client";

import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { ADMIN_DATA_STORAGE_KEY, demoWeddingAdminData, type WeddingAdminData } from "@/lib/admin-data";
import { useWeddingDataStore } from "@/lib/wedding-data-store";

const ACCESS_STORAGE_KEY = "nasze-wesele-access";
const ACCESS_CHANGE_EVENT = "nasze-wesele-access-change";

export function AccessGate({ children, initialData = demoWeddingAdminData, remoteSlug }: { children: React.ReactNode; initialData?: WeddingAdminData; remoteSlug?: string }) {
  const [data] = useWeddingDataStore(remoteSlug ? `${ADMIN_DATA_STORAGE_KEY}:${remoteSlug}` : undefined, initialData, remoteSlug ? { remoteSlug } : undefined);
  const requiredCode = data.theme.weddingCode.trim();
  const requiresCode = data.theme.accessMode === "code" && Boolean(requiredCode);
  const storageKey = `${ACCESS_STORAGE_KEY}:${requiredCode.toLowerCase()}`;
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const normalizedRequiredCode = useMemo(() => normalizeCode(requiredCode), [requiredCode]);
  const unlocked = useSyncExternalStore(
    subscribeAccess,
    () => !requiresCode || window.sessionStorage.getItem(storageKey) === "granted",
    () => !requiresCode
  );

  if (!requiresCode || unlocked) return <>{children}</>;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (normalizeCode(code) === normalizedRequiredCode) {
      window.sessionStorage.setItem(storageKey, "granted");
      window.dispatchEvent(new Event(ACCESS_CHANGE_EVENT));
      setError("");
      return;
    }
    setError("Kod nie pasuje. Sprawdz zaproszenie albo zapytaj pare mloda.");
  }

  return (
    <main className="min-h-screen bg-[#fffaf4] text-stone-950">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(27,55,48,0.92),rgba(123,84,77,0.50)),url('/hero-wedding.svg')] bg-cover bg-center" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fffaf4] to-transparent" />
        <div className="relative mx-auto grid min-h-screen max-w-6xl place-items-end px-5 pb-10 pt-20 sm:px-8">
          <div className="grid w-full gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
            <div className="pb-4 text-white">
              <p className="w-fit rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur">Prywatna strona wesela</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.04] tracking-normal sm:text-7xl">{data.wedding.bride} i {data.wedding.groom}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">Wpisz kod z zaproszenia, zeby zobaczyc informacje dla gosci.</p>
            </div>
            <form onSubmit={submit} className="rounded-[2rem] border border-white/25 bg-white/92 p-6 shadow-2xl shadow-stone-900/20 backdrop-blur">
              <LockKeyhole className="size-8 text-[#2f5d50]" />
              <h2 className="mt-4 text-2xl font-semibold">Kod wesela</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Kod znajdziesz w zaproszeniu albo wiadomosci od pary mlodej.</p>
              <input
                className="mt-5 h-13 w-full rounded-2xl border border-stone-300 bg-white px-4 text-center text-lg font-bold uppercase tracking-[0.2em] outline-none focus:border-[#2f5d50] focus:ring-2 focus:ring-[#2f5d50]/20"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="KOD"
                autoComplete="one-time-code"
              />
              {error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
              <button type="submit" className="mt-4 h-12 w-full rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#254b40]">Wejdz na strone</button>
              <div className="mt-5 flex gap-3 rounded-2xl bg-[#fffaf4] p-3 text-sm leading-6 text-stone-600">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#2f5d50]" />
                <p>Kod ogranicza dostep osobom, ktore przypadkowo dostaly link. Nie zastepuje logowania do panelu pary.</p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function normalizeCode(value: string) {
  return value.replace(/\s+/g, "").trim().toLowerCase();
}

function subscribeAccess(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("storage", callback);
  window.addEventListener(ACCESS_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ACCESS_CHANGE_EVENT, callback);
  };
}
