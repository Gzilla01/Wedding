export const uploadSecurity = {
  maxFiles: 30,
  maxFileSizeMb: 25,
  acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "video/mp4", "video/quicktime"],
  maxVideoLengthSeconds: 60,
};

export function isAcceptedUploadType(file: File) {
  if (file.type.startsWith("image/")) return true;
  return uploadSecurity.acceptedTypes.includes(file.type);
}
