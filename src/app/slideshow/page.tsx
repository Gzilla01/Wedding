import { galleryItems } from "@/lib/demo-data";

export default function SlideshowPage() {
  const items = galleryItems.filter((item) => item.approved);
  return (
    <main className="min-h-screen bg-stone-950 p-4 text-white">
      <div className="grid min-h-[calc(100vh-2rem)] place-items-center">
        <div className="w-full max-w-5xl">
          <p className="mb-4 text-center text-sm uppercase tracking-[0.24em] text-white/60">Nasze Wesele | pokaz slajdow</p>
          <div className="grid gap-4 md:grid-cols-3">
            {items.slice(0, 6).map((item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={item.caption} className="aspect-[4/5] w-full rounded-lg object-cover" key={item.id} src={item.src} />
            ))}
          </div>
        </div>
      </div>
      <meta httpEquiv="refresh" content="15" />
    </main>
  );
}
