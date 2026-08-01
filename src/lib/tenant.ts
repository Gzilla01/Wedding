export type TenantRoute = {
  slug: string;
  publicPath: string;
  adminPath: string;
  storagePrefix: string;
};

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

export function createTenantRoute(slug: string): TenantRoute {
  const normalizedSlug = normalizeWeddingSlug(slug);
  return {
    slug: normalizedSlug,
    publicPath: `/w/${normalizedSlug}`,
    adminPath: `/app/${normalizedSlug}`,
    storagePrefix: `weddings/${normalizedSlug}`,
  };
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getPublicWeddingUrl(slug: string) {
  return `${getSiteUrl()}${createTenantRoute(slug).publicPath}`;
}
