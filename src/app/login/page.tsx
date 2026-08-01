"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email")?.toString(),
        password: form.get("password")?.toString(),
      }),
    });
    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Nie udalo sie zalogowac.");
      return;
    }
    const payload = await response.json().catch(() => null);
    router.replace(payload?.requiresPasswordChange ? "/login/change-password" : "/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(216,189,114,0.24),transparent_30rem),linear-gradient(180deg,#fffaf4,#f8f1e8)] px-5 py-10 text-stone-950">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-[#d8bd72]/24 bg-white p-6 shadow-2xl shadow-stone-900/10">
        <span className="grid size-12 place-items-center rounded-full bg-[#e0f0eb] text-[#2f5d50]"><LockKeyhole className="size-6" /></span>
        <h1 className="mt-5 text-3xl font-semibold">Logowanie do panelu</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">Zaloguj sie jako superadmin, zeby zarzadzac weselem Aleksandry i Pawla.</p>
        <label className="mt-5 block text-sm font-semibold text-stone-700">Email albo admin</label>
        <input className="field mt-2" name="email" autoComplete="username" placeholder="admin" required />
        <label className="mt-4 block text-sm font-semibold text-stone-700">Haslo</label>
        <input className="field mt-2" name="password" type="password" autoComplete="current-password" required />
        {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        <button className="mt-5 h-12 w-full rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#254b40] disabled:opacity-60" type="submit" disabled={loading}>
          {loading ? "Loguje..." : "Zaloguj"}
        </button>
      </form>
    </main>
  );
}
