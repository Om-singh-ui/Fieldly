// lib/format.ts
export function formatINR(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "—";
  
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// For numbers without currency symbol
export function formatNumber(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "—";
  
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}