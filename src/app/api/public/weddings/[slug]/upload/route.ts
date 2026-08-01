import { randomUUID } from "crypto";
import { z } from "zod";
import { getWeddingBySlug, jsonError, requireAdminSupabase } from "@/lib/wedding-admin-server";
import { uploadSecurity } from "@/lib/upload-security";

const uploadMetaSchema = z.object({
  author: z.string().trim().max(80).optional(),
  caption: z.string().trim().max(240).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const wedding = await getWeddingBySlug(slug);
    if (!wedding.is_published) return jsonError("To wesele nie jest jeszcze opublikowane.", 403);

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "wedding-media";
    const formData = await request.formData();
    const meta = uploadMetaSchema.parse({
      author: formData.get("author")?.toString(),
      caption: formData.get("caption")?.toString(),
    });
    const files = formData.getAll("files").filter((value): value is File => value instanceof File);

    if (files.length === 0) return jsonError("Dodaj przynajmniej jeden plik.");
    if (files.length > uploadSecurity.maxFiles) return jsonError(`Mozesz dodac maksymalnie ${uploadSecurity.maxFiles} plikow naraz.`);

    const supabase = requireAdminSupabase();
    const uploaded = [];

    for (const file of files) {
      if (!isAcceptedServerUpload(file)) return jsonError(`Nieobslugiwany typ pliku: ${file.name}`);
      if (file.size > uploadSecurity.maxFileSizeMb * 1024 * 1024) {
        return jsonError(`Plik ${file.name} przekracza ${uploadSecurity.maxFileSizeMb} MB.`);
      }

      const extension = extensionFromFile(file);
      const filePath = `${wedding.slug}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${extension}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
      if (uploadError) return jsonError(uploadError.message, 500);

      const { data: record, error: recordError } = await supabase
        .from("wedding_media_uploads")
        .insert({
          wedding_id: wedding.id,
          author_name: meta.author || null,
          caption: meta.caption || null,
          file_path: filePath,
          file_name: file.name,
          file_type: file.type || "application/octet-stream",
          file_size_bytes: file.size,
          status: "pending",
        })
        .select("id, file_name, status")
        .single();

      if (recordError) return jsonError(recordError.message, 500);
      uploaded.push(record);
    }

    return Response.json({ ok: true, uploaded });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udalo sie wyslac plikow.";
    return jsonError(message, 400);
  }
}

function isAcceptedServerUpload(file: File) {
  if (file.type.startsWith("image/")) return true;
  return uploadSecurity.acceptedTypes.includes(file.type);
}

function extensionFromFile(file: File) {
  const match = file.name.toLowerCase().match(/\.[a-z0-9]+$/);
  if (match) return match[0].slice(0, 12);
  if (file.type === "image/jpeg") return ".jpg";
  if (file.type === "image/png") return ".png";
  if (file.type === "video/mp4") return ".mp4";
  return "";
}
