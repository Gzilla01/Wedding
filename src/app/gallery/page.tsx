import Link from "next/link";
import { Camera, MonitorPlay } from "lucide-react";

export default function GalleryPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link className="text-sm font-semibold text-[#2f5d50]" href="/">Powrot</Link>
        <Link className="btn-small-outline" href="/slideshow"><MonitorPlay className="mr-2 size-4" /> Pokaz slajdow</Link>
      </div>
      <section className="mt-8 grid min-h-[60vh] place-items-center rounded-[2rem] border border-[#d8bd72]/24 bg-white p-8 text-center shadow-xl shadow-stone-900/6">
        <div>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef5f1] text-[#2f5d50]"><Camera className="size-7" /></span>
          <h1 className="mt-5 text-4xl font-semibold">Galeria gosci</h1>
          <p className="mx-auto mt-3 max-w-xl text-stone-600">
            Galeria jest czysta. Zdjecia i filmy dodane przez gosci pojawia sie po zatwierdzeniu w panelu.
          </p>
          <Link className="btn-primary mt-6" href="/upload"><Camera className="size-5" /> Dodaj zdjecia</Link>
        </div>
      </section>
    </main>
  );
}
