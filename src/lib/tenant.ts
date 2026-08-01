const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeWeddingSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function isValidWeddingSlug(value: string) {
  return value.length >= 3 && value.length <= 64 && slugPattern.test(value);
}
