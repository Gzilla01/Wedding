import Link from "next/link";
import { UploadForm } from "@/components/guest/upload-form";
import { photoChallenges } from "@/lib/demo-data";

export default async function UploadPage({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w } = await searchParams;
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(216,189,114,0.24),transparent_30rem),linear-gradient(180deg,#fffaf4,#f8f1e8)] px-5 py-8">
      <div className="mx-auto max-w-3xl">
      <Link className="text-sm font-semibold text-[#2f5d50]" href={w ? `/w/${w}` : "/"}>Powrot do strony wesela</Link>
      <div className="mt-6 rounded-[2rem] border border-[#d8bd72]/24 bg-white/88 p-6 shadow-xl shadow-stone-900/6">
        <p className="w-fit rounded-full bg-[#e0f0eb] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2f5d50]">Wspolna galeria</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal">Podarujcie nam wspomnienie</h1>
        <p className="mt-3 text-lg leading-8 text-stone-600">Dodaj kilka zdjec albo krotki film z telefonu. Najpiekniejsze momenty trafia do galerii po zatwierdzeniu przez pare.</p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {photoChallenges.slice(0, 4).map((challenge) => (
          <article className="rounded-2xl border border-[#d8bd72]/25 bg-white p-4 shadow-sm" key={challenge.id}>
            <p className="font-semibold">{challenge.title}</p>
            <p className="mt-1 text-sm text-stone-600">{challenge.description}</p>
          </article>
        ))}
      </div>
      <UploadForm slug={w} />
      </div>
    </main>
  );
}
