import { useQuery } from "@tanstack/react-query";

async function fetchPricing(promoCode) {
  const url = promoCode
    ? `/api/v1/pricing?promoCode=${encodeURIComponent(promoCode)}`
    : "/api/v1/pricing";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load pricing");
  return res.json();
}

/**
 * Reshape the backend response into the shape PackageTiers expects:
 * {
 *   economy: { monthlyPrice, yearlyMonthlyEquiv, annualPrice, yearlyDiscountPct, isActive },
 *   premium:  { ... },
 *   luxury:   { ... },
 *   activeDiscount: { isActive, tier, billingCycle, displayLabel, endDate } | null,
 * }
 */
function transformPricing(apiData) {
  const plans = apiData?.plans ?? [];
  const byTier = {};

  for (const plan of plans) {
    const tier = plan.tier.toLowerCase(); // "economy" | "premium" | "luxury"
    if (!byTier[tier]) byTier[tier] = { isActive: true };

    if (plan.billingCycle === "Monthly") {
      byTier[tier].monthlyPrice = plan.price;
      byTier[tier].monthlyPlanId = plan.id;
    } else if (plan.billingCycle === "Yearly") {
      byTier[tier].annualPrice = plan.price;
      byTier[tier].yearlyMonthlyEquiv = plan.price / 12;
      byTier[tier].yearlyPlanId = plan.id;
    }
  }

  // Derive yearly savings % from the two prices
  for (const tier of Object.keys(byTier)) {
    const d = byTier[tier];
    if (d.monthlyPrice != null && d.annualPrice != null) {
      const fullYearly = d.monthlyPrice * 12;
      d.yearlyDiscountPct = ((fullYearly - d.annualPrice) / fullYearly) * 100;
    }
  }

  const raw = apiData?.appliedDiscount ?? null;
  const activeDiscount = raw
    ? {
        isActive: true,
        tier: raw.tier?.toLowerCase() ?? null,
        billingCycle: raw.billingCycle?.toLowerCase() ?? null,
        displayLabel: raw.displayLabel ?? "Limited Offer",
        endDate: raw.endDate ?? null,
        discountedMonthlyPrice: raw.discountedMonthlyPrice ?? null,
        discountedYearlyMonthlyEquiv: raw.discountedYearlyMonthlyEquiv ?? null,
      }
    : null;

  return { ...byTier, activeDiscount };
}

export function usePricing(promoCode = null) {
  return useQuery({
    queryKey: ["pricing", promoCode],
    queryFn: () =>
      fetchPricing(promoCode).then((json) => {
        console.log("[usePricing] raw response:", json);
        const transformed = transformPricing(json.data);
        console.log("[usePricing] transformed:", transformed);
        return transformed;
      }),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
