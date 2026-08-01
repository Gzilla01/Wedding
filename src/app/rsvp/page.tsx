import Link from "next/link";
import { RsvpForm } from "@/components/guest/rsvp-form";

const WEDDING_SLUG = "aleksandra-pawel-2028";

export default async function RsvpPage({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
  const { w } = await searchParams;
  return <main className="mx-auto min-h-screen max-w-3xl px-5 py-8"><Link className="text-sm font-semibold text-[#2f5d50]" href="/">Powrot</Link><h1 className="mt-6 text-4xl font-semibold">RSVP</h1><p className="mt-3 text-stone-600">Potwierdz obecnosc, diete, nocleg i transport.</p><RsvpForm slug={w || WEDDING_SLUG} /></main>;
}
