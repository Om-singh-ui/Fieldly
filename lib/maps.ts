export function getGoogleMapsUrl(
  lat?: number | null,
  lng?: number | null,
) {
  if (!lat || !lng) return null;

  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function getGoogleEmbedUrl(
  lat?: number | null,
  lng?: number | null,
) {
  if (!lat || !lng) return null;

  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}