import Link from "next/link";
import { UploadForm } from "@/components/guest/upload-form";

const WEDDING_SLUG = "aleksandra-pawel-2028";

export default async function UploadPage({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w } = await searchParams;
  const slug = w || WEDDING_SLUG;
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(216,189,114,0.24),transparent_30rem),linear-gradient(180deg,#fffaf4,#f8f1e8)] px-5 py-8">
      <div className="mx-auto max-w-3xl">
      <Link className="text-sm font-semibold text-[#2f5d50]" href="/">Powrot do strony wesela</Link>
      <div className="mt-6 rounded-[2rem] border border-[#d8bd72]/24 bg-white/88 p-6 shadow-xl shadow-stone-900/6">
        <p className="w-fit rounded-full bg-[#e0f0eb] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#2f5d50]">Wspolna galeria</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal">Podarujcie nam wspomnienie</h1>
        <p className="mt-3 text-lg leading-8 text-stone-600">Dodaj kilka zdjec albo krotki film z telefonu. Najpiekniejsze momenty trafia do galerii po zatwierdzeniu przez pare.</p>
      </div>
      <UploadForm slug={slug} />
      </div>
    </main>
  );
}
