import Link from "next/link";
import { SongRequestForm } from "@/components/guest/song-request-form";

export default async function MusicPage({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w } = await searchParams;
  return <main className="mx-auto min-h-screen max-w-3xl px-5 py-8"><Link className="text-sm font-semibold text-[#2f5d50]" href={w ? `/w/${w}` : "/"}>Powrot</Link><h1 className="mt-6 text-4xl font-semibold">Ankieta muzyczna</h1><p className="mt-3 text-stone-600">Zaproponuj piosenke dla DJ-a albo zespolu.</p><SongRequestForm slug={w} /></main>;
}
