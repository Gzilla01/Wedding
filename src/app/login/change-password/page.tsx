"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = form.get("password")?.toString() || "";
    const confirmPassword = form.get("confirmPassword")?.toString() || "";

    if (password !== confirmPassword) {
      setError("Hasla musza byc takie same.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Nie udalo sie zmienic hasla.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(216,189,114,0.24),transparent_30rem),linear-gradient(180deg,#fffaf4,#f8f1e8)] px-5 py-10 text-stone-950">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-[#d8bd72]/24 bg-white p-6 shadow-2xl shadow-stone-900/10">
        <span className="grid size-12 place-items-center rounded-full bg-[#e0f0eb] text-[#2f5d50]"><KeyRound className="size-6" /></span>
        <h1 className="mt-5 text-3xl font-semibold">Ustaw nowe haslo</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">To haslo zastapi haslo startowe z maila. Po zapisaniu od razu wejdziesz do panelu.</p>
        <label className="mt-5 block text-sm font-semibold text-stone-700">Nowe haslo</label>
        <input className="field mt-2" name="password" type="password" autoComplete="new-password" minLength={8} required />
        <label className="mt-4 block text-sm font-semibold text-stone-700">Powtorz nowe haslo</label>
        <input className="field mt-2" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        <button className="mt-5 h-12 w-full rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#254b40] disabled:opacity-60" type="submit" disabled={loading}>
          {loading ? "Zapisuje..." : "Zapisz nowe haslo"}
        </button>
      </form>
    </main>
  );
}
