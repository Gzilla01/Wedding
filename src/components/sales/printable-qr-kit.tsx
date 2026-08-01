"use client";

import { QRCodeCanvas } from "qrcode.react";
import { getSiteUrl } from "@/lib/tenant";

const qrItems = [
  { id: "home", label: "Strona wesela", text: "Zeskanuj kod i zobacz wszystkie informacje o weselu", path: "/" },
  { id: "photos", label: "Dodaj zdjecia", text: "Zeskanuj kod i dodaj zdjecia lub krotkie wideo z wesela", path: "/upload" },
  { id: "gallery", label: "Galeria gosci", text: "Zeskanuj kod i zobacz wspolna galerie weselna", path: "/gallery" },
  { id: "seat", label: "Znajdz stolik", text: "Zeskanuj kod i sprawdz, przy ktorym stoliku siedzisz", path: "/#miejsce" },
  { id: "rsvp", label: "RSVP", text: "Zeskanuj kod i potwierdz obecnosc", path: "/rsvp" },
];

export function PrintableQrKit() {
  function value(path: string) {
    return `${getSiteUrl()}${path}`;
  }

  function download(id: string) {
    const canvas = document.getElementById(`print-qr-${id}`) as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `nasze-wesele-${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="h-11 rounded-full bg-[#2f5d50] px-5 text-sm font-semibold text-white">Drukuj zestaw</button>
        {qrItems.map((item) => <button key={item.id} type="button" onClick={() => download(item.id)} className="h-11 rounded-full border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700">PNG {item.label}</button>)}
      </div>
      <div className="grid gap-5 md:grid-cols-2 print:grid-cols-2">
        {qrItems.map((item) => (
          <article key={item.id} className="break-inside-avoid rounded-[2rem] border border-[#d8bd72]/35 bg-white p-6 text-center shadow-xl shadow-stone-900/5 print:shadow-none">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2f7d6d]">Nasze Wesele</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">{item.label}</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-stone-600">{item.text}</p>
            <div className="mx-auto mt-6 grid w-fit place-items-center rounded-3xl border border-[#d8bd72]/30 bg-[#fffaf4] p-5">
              <QRCodeCanvas id={`print-qr-${item.id}`} value={value(item.path)} size={210} marginSize={2} />
            </div>
            <p className="mt-4 break-all text-xs text-stone-500">{value(item.path)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
