"use client";

import { FormEvent, useState } from "react";
import { Heart, Video } from "lucide-react";

export function GuestbookForm({ slug = process.env.NEXT_PUBLIC_WEDDING_SLUG || "aleksandra-pawel-2028" }: { slug?: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [videoName, setVideoName] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/public/weddings/${encodeURIComponent(slug)}/guestbook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name")?.toString(),
        message: formData.get("message")?.toString(),
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Nie udalo sie dodac wpisu.");
      return;
    }
    setDone(true);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="wedding-card mt-6 space-y-3 rounded-3xl p-5">
      <input className="field" name="name" placeholder="Imie" required />
      <textarea className="field min-h-40" name="message" placeholder="Twoje zyczenia" required />
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8bd72]/60 bg-[#fffaf4] p-5 text-center">
        <Video className="mb-2 size-8 text-[#2f5d50]" />
        <span className="font-semibold">Dodaj video z zyczeniami</span>
        <span className="mt-1 text-sm text-stone-600">Opcjonalnie, najlepiej do 30 sekund</span>
        <input className="sr-only" type="file" accept="video/*" capture="user" onChange={(event) => setVideoName(event.target.files?.[0]?.name ?? "")} />
      </label>
      {videoName && <p className="rounded-2xl bg-[#eef5f1] p-3 text-sm text-[#2f5d50]">Wybrane video: {videoName}</p>}
      <button className="btn-primary w-full" type="submit"><Heart className="size-5" /> Dodaj wpis</button>
      {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      {done && <p className="rounded-lg bg-[#eef5f1] p-3 text-[#2f5d50]">Dziekujemy za wpis.</p>}
    </form>
  );
}
