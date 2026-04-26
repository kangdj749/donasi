export function appendAffiliateParams(
  url: string,
  ref?: string,
  src?: string
) {
  try {
    const u = new URL(url, typeof window !== "undefined" ? window.location.origin : "https://dummy.com");

    if (ref) u.searchParams.set("ref", ref);
    if (src) u.searchParams.set("src", src || "internal");

    return u.pathname + "?" + u.searchParams.toString();
  } catch {
    return url;
  }
}