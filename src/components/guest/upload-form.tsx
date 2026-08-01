"use client";

import { useState } from "react";
import { z } from "zod";
import { Camera, CheckCircle2, Upload } from "lucide-react";
import { isAcceptedUploadType, uploadSecurity } from "@/lib/upload-security";

const uploadSchema = z.object({
  author: z.string().max(80).optional(),
  caption: z.string().max(240).optional(),
});

export function UploadForm({ slug = process.env.NEXT_PUBLIC_WEDDING_SLUG || "aleksandra-pawel-2028" }: { slug?: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setMessage("");
    const parsed = uploadSchema.safeParse({
      author: formData.get("author")?.toString(),
      caption: formData.get("caption")?.toString(),
    });
    if (!parsed.success) {
      setMessage("Sprawdz podpis lub imie. Tekst jest za dlugi.");
      return;
    }
    if (files.length === 0) {
      setMessage("Dodaj przynajmniej jedno zdjecie albo film.");
      return;
    }
    if (files.length > uploadSecurity.maxFiles) {
      setMessage(`Mozesz dodac maksymalnie ${uploadSecurity.maxFiles} plikow naraz.`);
      return;
    }
    const invalidType = files.some((file) => !isAcceptedUploadType(file));
    if (invalidType) {
      setMessage("Dodaj zdjecia albo krotkie wideo z telefonu.");
      return;
    }
    const tooLarge = files.some((file) => file.size > uploadSecurity.maxFileSizeMb * 1024 * 1024);
    if (tooLarge) {
      setMessage(`Pojedynczy plik moze miec maksymalnie ${uploadSecurity.maxFileSizeMb} MB.`);
      return;
    }
    const body = new FormData();
    body.set("author", parsed.data.author ?? "");
    body.set("caption", parsed.data.caption ?? "");
    files.forEach((file) => body.append("files", file));

    setProgress(20);
    const response = await fetch(`/api/public/weddings/${encodeURIComponent(slug)}/upload`, {
      method: "POST",
      body,
    });
    setProgress(100);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setMessage(payload?.error ?? "Nie udalo sie wyslac plikow.");
      return;
    }
    setFiles([]);
    setMessage("Dziekujemy. Pliki zostaly przyjete do moderacji.");
  }

  return (
    <form action={submit} className="mt-6 rounded-[2rem] border border-[#d8bd72]/25 bg-white p-5 shadow-xl shadow-stone-900/6">
      <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[#c2a45d] bg-[#fffaf0] p-6 text-center transition hover:bg-[#fff7df]">
        <Camera className="mb-3 size-10 text-[#2f5d50]" />
        <span className="text-xl font-semibold">Wybierz z telefonu albo zrob zdjecie</span>
        <span className="mt-2 text-stone-600">JPG, PNG, HEIC lub MP4, do {uploadSecurity.maxFileSizeMb} MB na plik</span>
        <input className="sr-only" type="file" accept="image/*,video/mp4,video/quicktime" capture="environment" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
      </label>
      {files.length > 0 && <p className="mt-3 rounded-2xl bg-[#eef5f1] p-3 text-sm font-medium text-[#1f5f52]">Wybrano plikow: {files.length}</p>}
      <div className="mt-4 grid gap-3">
        <input className="field" name="author" placeholder="Twoje imie (opcjonalnie)" />
        <textarea className="field min-h-28" name="caption" placeholder="Podpis lub krotka wiadomosc (opcjonalnie)" />
      </div>
      {progress > 0 && <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-100"><div className="h-full bg-[#2f5d50] transition-all" style={{ width: `${progress}%` }} /></div>}
      <button className="btn-primary mt-5 w-full justify-center" type="submit"><Upload className="size-5" /> Dodaj do galerii</button>
      {message && <p className="mt-4 flex items-center gap-2 rounded-2xl bg-[#eef5f1] p-3 text-[#2f5d50]"><CheckCircle2 className="size-5" /> {message}</p>}
    </form>
  );
}
