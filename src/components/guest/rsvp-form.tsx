"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(3),
  attending: z.enum(["yes", "no"]),
  companion: z.string().optional(),
  diet: z.string().optional(),
  allergies: z.string().optional(),
  accommodation: z.boolean().optional(),
  transport: z.boolean().optional(),
  message: z.string().optional(),
});

type RsvpData = z.infer<typeof schema>;

export function RsvpForm({ slug = process.env.NEXT_PUBLIC_WEDDING_SLUG || "aleksandra-pawel-2028" }: { slug?: string }) {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<RsvpData>({ resolver: zodResolver(schema), defaultValues: { attending: "yes" } });
  async function submit(data: RsvpData) {
    setServerError("");
    const response = await fetch(`/api/public/weddings/${encodeURIComponent(slug)}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setServerError(payload?.error ?? "Nie udalo sie zapisac RSVP.");
      return;
    }
    setDone(true);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-3 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <input className="field" {...register("name")} placeholder="Imie i nazwisko" />
      {errors.name && <p className="text-sm text-red-700">Podaj imie i nazwisko.</p>}
      <select className="field" {...register("attending")}><option value="yes">Potwierdzam obecnosc</option><option value="no">Nie moge przyjsc</option></select>
      <input className="field" {...register("companion")} placeholder="Osoba towarzyszaca" />
      <input className="field" {...register("diet")} placeholder="Dieta" />
      <input className="field" {...register("allergies")} placeholder="Alergie" />
      <label className="flex items-center gap-3 rounded-lg bg-stone-50 p-3"><input type="checkbox" {...register("accommodation")} /> Potrzebuje noclegu</label>
      <label className="flex items-center gap-3 rounded-lg bg-stone-50 p-3"><input type="checkbox" {...register("transport")} /> Korzystam z transportu</label>
      <textarea className="field min-h-28" {...register("message")} placeholder="Dodatkowa wiadomosc" />
      <button className="btn-primary w-full" type="submit">Wyslij RSVP</button>
      {serverError && <p className="rounded-lg bg-red-50 p-3 text-red-700">{serverError}</p>}
      {done && <p className="rounded-lg bg-[#eef5f1] p-3 text-[#2f5d50]">Dziekujemy, odpowiedz zostala zapisana.</p>}
    </form>
  );
}
