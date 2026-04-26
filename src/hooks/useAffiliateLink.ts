"use client";

import { useAffiliateContext } from "@/components/system/AffiliateContext";

export function useAffiliateLink() {
  const { ref, src } = useAffiliateContext();

  function withAff(url: string, customSrc?: string) {
    try {
      const u = new URL(url, window.location.origin);

      if (ref) u.searchParams.set("ref", ref);
      u.searchParams.set("src", customSrc || src || "internal");

      return u.pathname + "?" + u.searchParams.toString();
    } catch {
      return url;
    }
  }

  return { withAff, ref, src };
}