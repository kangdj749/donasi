import { fetchSheet, RANGE } from "./google-sheet"

/* =========================
   CACHE (CONSISTENT ENGINE)
========================= */

type CacheEntry<T> = {
  data: T
  expiry: number
}

const CACHE_TTL = 5 * 60 * 1000

const cache = new Map<string, CacheEntry<unknown>>()
const inFlight = new Map<string, Promise<unknown>>()

function getCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  if (Date.now() > entry.expiry) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

function setCache<T>(key: string, data: T) {
  cache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL,
  })
}

/* =========================
   TYPES
========================= */

type RawProduct = Record<string, unknown>

export type CampaignProduct = {
  id: string
  campaign_id: string
  title: string
  subtitle: string
  price: number
  type: "wa" | "donation"
  image?: string
  wa_phone?: string
  weight?: string
  stock?: number
  order: number
}

/* =========================
   HELPERS
========================= */

function s(val: unknown): string {
  return String(val ?? "").trim()
}

function toNumber(val: unknown): number {
  const n = Number(String(val ?? "").replace(/[^\d]/g, ""))
  return Number.isNaN(n) ? 0 : n
}

function toBool(val: unknown): boolean {
  const v = s(val).toLowerCase()
  return ["true", "1", "yes", "active"].includes(v)
}

function resolveProductType(val: unknown): "wa" | "donation" {
  const v = s(val).toLowerCase()

  if (["wa", "whatsapp"].includes(v)) return "wa"
  return "donation"
}

/* =========================
   FETCH WITH CACHE
========================= */

async function getAllProducts(): Promise<RawProduct[]> {
  const cacheKey = "ALL_PRODUCTS"

  const cached = getCache<RawProduct[]>(cacheKey)
  if (cached) return cached

  if (inFlight.has(cacheKey)) {
    return inFlight.get(cacheKey) as Promise<RawProduct[]>
  }

  const promise = (async () => {
    try {
      const rows = await fetchSheet<RawProduct>(
        RANGE.CAMPAIGN_PRODUCTS
      )

      const safe = Array.isArray(rows) ? rows : []

      setCache(cacheKey, safe)

      return safe
    } catch (err) {
      console.error("🔥 PRODUCT SHEET ERROR:", err)

      if (cached) return cached

      return []
    }
  })()

  inFlight.set(cacheKey, promise)

  try {
    return await promise
  } finally {
    inFlight.delete(cacheKey)
  }
}

/* =========================
   MAIN API
========================= */

export async function getCampaignProducts(
  campaignId: string
): Promise<CampaignProduct[]> {
  if (!campaignId) return []

  const rows = await getAllProducts()

  const result = rows
    .filter((r) => {
      // ✅ HANDLE string / number mismatch
      const idMatch =
        s(r.campaign_id) === campaignId ||
        Number(r.campaign_id) === Number(campaignId)

      // ✅ HANDLE empty is_active (default TRUE)
      const isActive =
        r.is_active === undefined ||
        r.is_active === "" ||
        toBool(r.is_active)

      return idMatch && isActive
    })
    .map((r) => ({
      id: s(r.id),
      campaign_id: s(r.campaign_id),
      title: s(r.title),
      subtitle: s(r.subtitle),
      price: toNumber(r.price),
      type: resolveProductType(r.type),
      image: s(r.image) || undefined,
      wa_phone: s(r.wa_phone) || undefined,
      weight: s(r.weight) || undefined,
      stock: toNumber(r.stock),
      order: toNumber(r.order),
    }))
    .sort((a, b) => a.order - b.order)

  return result
}