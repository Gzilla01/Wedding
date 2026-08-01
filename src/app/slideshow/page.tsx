import Link from "next/link";
import { MonitorPlay } from "lucide-react";

export default function SlideshowPage() {
  return (
    <main className="min-h-screen bg-stone-950 p-4 text-white">
      <div className="grid min-h-[calc(100vh-2rem)] place-items-center">
        <div className="max-w-xl text-center">
          <MonitorPlay className="mx-auto size-14 text-[#d8bd72]" />
          <p className="mt-5 text-sm uppercase tracking-[0.24em] text-white/60">Aleksandra i Pawel 2028</p>
          <h1 className="mt-4 text-4xl font-semibold">Pokaz slajdow jest pusty</h1>
          <p className="mt-3 text-white/70">Zdjecia dodane przez gosci pojawia sie tutaj po zatwierdzeniu w panelu.</p>
          <Link className="mt-6 inline-flex h-12 items-center rounded-full bg-white px-5 text-sm font-semibold text-stone-950" href="/gallery">Wroc do galerii</Link>
        </div>
      </div>
      <meta httpEquiv="refresh" content="30" />
    </main>
  );
}
