import Link from "next/link";
import { Heart, MonitorPlay } from "lucide-react";
import { galleryItems } from "@/lib/demo-data";

export default function GalleryPage() {
  const approved = galleryItems.filter((item) => item.approved);
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link className="text-sm font-semibold text-[#2f5d50]" href="/">Powrot</Link>
        <Link className="btn-small-outline" href="/slideshow"><MonitorPlay className="mr-2 size-4" /> Pokaz slajdow</Link>
      </div>
      <h1 className="mt-6 text-4xl font-semibold">Galeria gosci</h1>
      <p className="mt-3 text-stone-600">Zakladka Najnowsze i Najpopularniejsze jest gotowa na dane z Supabase; teraz pokazujemy zatwierdzone demo.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {approved.map((item) => (
          <a className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm" href={item.src} key={item.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={item.caption} className="aspect-[4/5] w-full object-cover transition group-hover:scale-105" src={item.src} />
            <div className="flex items-center justify-between p-3 text-sm"><span>{item.author}</span><span className="flex items-center gap-1 text-[#7b544d]"><Heart className="size-4" /> {item.likes}</span></div>
          </a>
        ))}
      </div>
    </main>
  );
}
