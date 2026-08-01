import Link from "next/link";
import { GuestbookForm } from "@/components/guest/guestbook-form";

export default async function GuestbookPage({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w } = await searchParams;
  return <main className="mx-auto min-h-screen max-w-3xl px-5 py-8"><Link className="text-sm font-semibold text-[#2f5d50]" href={w ? `/w/${w}` : "/"}>Powrot</Link><h1 className="mt-6 text-4xl font-semibold">Cyfrowa ksiega gosci</h1><p className="mt-3 text-stone-600">Zostaw zyczenia tekstem albo nagraj krotkie video dla pary mlodej. Po weselu wpisy mozna wyeksportowac jako pamiatke.</p><GuestbookForm slug={w} /></main>;
}
