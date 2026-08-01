"use client";

import { FormEvent, useEffect, useState } from "react";
import { Music2 } from "lucide-react";

export function SongRequestForm({ slug = process.env.NEXT_PUBLIC_WEDDING_SLUG || "aleksandra-pawel-2028" }: { slug?: string }) {
  const [songs, setSongs] = useState<Array<{ id: string; title: string; votes: number }>>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/public/weddings/${encodeURIComponent(slug)}/songs`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload) => setSongs(payload.songs ?? []))
      .catch(() => setSongs([{ id: "demo-1", title: "Dawid Podsiadlo - Malomiasteczkowy", votes: 0 }, { id: "demo-2", title: "ABBA - Dancing Queen", votes: 0 }]));
  }, [slug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const song = formData.get("song")?.toString();
    const response = await fetch(`/api/public/weddings/${encodeURIComponent(slug)}/songs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Nie udalo sie dodac piosenki.");
      return;
    }
    const payload = await response.json();
    if (payload.song) {
      setSongs((current) => [payload.song, ...current.filter((item) => item.id !== payload.song.id)]);
    }
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <input className="field" name="song" placeholder="Wykonawca - tytul" required />
      <button className="btn-primary mt-3 w-full" type="submit"><Music2 className="size-5" /> Dodaj propozycje</button>
      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      <div className="mt-5 space-y-2">{songs.map((song) => <div className="flex items-center justify-between rounded-lg bg-stone-50 p-3" key={song.id}><span>{song.title}</span><span className="btn-small-outline">{song.votes} glosow</span></div>)}</div>
    </form>
  );
}
