import { useQuery } from "@tanstack/react-query";

async function fetchPricing(promoCode) {
  const url = promoCode
    ? `/api/v1/pricing?promoCode=${encodeURIComponent(promoCode)}`
    : "/api/v1/pricing";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load pricing");
  return res.json();
}

export function usePricing(promoCode = null) {
  return useQuery({
    queryKey: ["pricing", promoCode],
    queryFn: () => fetchPricing(promoCode),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
