import { fetchSheet, RANGE } from "./google-sheet";

/* =========================
   CACHE (SMART + SINGLE FLIGHT)
========================= */

type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const CACHE_TTL = 5 * 60 * 1000;

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCache<T>(key: string, data: T) {
  cache.set(key, {
    data,
    expiry: Date.now() + CACHE_TTL,
  });
}

/* =========================
   TYPES
========================= */

type RawCampaign = Record<string, unknown>;
type RawStory = Record<string, unknown>;
type RawOrganization = Record<string, unknown>;

export type CampaignType =
  | "donation"
  | "qurban"
  | "zakat"
  | "event";

export type Organization = {
  id: string;
  slug: string;
  name: string;
  type: string;
  logo?: string;
  banner_image?: string;
  description?: string;
  verified: boolean;
};

export type CampaignStorySection = {
  id: string;
  campaign_id: string;
  type: string;
  content?: string;
  image_id?: string;
  video_url?: string;
  section_order: number;
};

export type Campaign = {
  id: string;
  organization_id: string;
  slug: string;
  title: string;
  short_tagline: string;
  category: string;
  type: CampaignType;

  hero_image_public_id: string;
  hero_video_url?: string;

  goal_amount: number;
  collected_amount: number;

  donor_count: number;
  prayer_count: number;

  status: string;

  organization?: Organization;
  stories: CampaignStorySection[];
};

/* =========================
   HELPERS
========================= */

function s(val: unknown): string {
  return String(val ?? "").trim();
}

function toNumber(val: unknown): number {
  const n = Number(String(val ?? "").replace(/[^\d]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

function toBoolean(val: unknown): boolean {
  const v = s(val).toLowerCase();
  return v === "true" || v === "active" || v === "1";
}

/* =========================
   TYPE RESOLVER (🔥 IMPORTANT)
========================= */

function resolveType(
  type?: unknown,
  category?: unknown
): CampaignType {
  const t = s(type).toLowerCase();

  // ✅ PRIORITAS TYPE (STRICT)
  if (t === "qurban") return "qurban";
  if (t === "zakat") return "zakat";
  if (t === "event") return "event";
  if (t === "donation") return "donation";

  // 🔥 DEBUG
  console.log("⚠️ FALLBACK TYPE:", t, category);

  // fallback
  const c = s(category).toLowerCase();

  if (c.includes("qurban")) return "qurban";
  if (c.includes("zakat")) return "zakat";
  if (c.includes("event")) return "event";

  return "donation";
}

/* =========================
   FETCH ENGINE
========================= */

type AllSheets = {
  campaigns: RawCampaign[];
  stories: RawStory[];
  orgs: RawOrganization[];
};

async function getAllSheets(): Promise<AllSheets> {
  const cacheKey = "ALL_SHEETS";

  const cached = getCache<AllSheets>(cacheKey);
  if (cached) return cached;

  if (inFlight.has(cacheKey)) {
    return inFlight.get(cacheKey) as Promise<AllSheets>;
  }

  const promise = (async () => {
    try {
      const [campaigns, stories, orgs] = await Promise.all([
        fetchSheet<RawCampaign>(RANGE.CAMPAIGNS),
        fetchSheet<RawStory>(RANGE.CAMPAIGN_STORY),
        fetchSheet<RawOrganization>(RANGE.ORGANIZATIONS),
      ]);

      const safe: AllSheets = {
        campaigns: Array.isArray(campaigns) ? campaigns : [],
        stories: Array.isArray(stories) ? stories : [],
        orgs: Array.isArray(orgs) ? orgs : [],
      };

      setCache(cacheKey, safe);

      return safe;
    } catch (err) {
      console.error("🔥 SHEET ERROR:", err);

      if (cached) return cached;

      return {
        campaigns: [],
        stories: [],
        orgs: [],
      };
    }
  })();

  inFlight.set(cacheKey, promise);

  try {
    return await promise;
  } finally {
    inFlight.delete(cacheKey);
  }
}

/* =========================
   NORMALIZER
========================= */

function normalizeOrganization(
  raw: RawOrganization
): Organization {
  return {
    id: s(raw.id),
    slug: s(raw.slug),
    name: s(raw.name),
    type: s(raw.type),
    logo: s(raw.logo) || undefined,
    banner_image: s(raw.banner_image) || undefined,
    description: s(raw.description) || undefined,
    verified: toBoolean(raw.verified),
  };
}

function normalizeCampaign(raw: RawCampaign): Campaign {
  return {
    id: s(raw.id),
    organization_id: s(raw.organization_id),
    slug: s(raw.slug),
    title: s(raw.title),
    short_tagline: s(raw.short_tagline),
    category: s(raw.category),

    /* 🔥 CORE FIX */
    type: resolveType(raw.type, raw.category),

    hero_image_public_id: s(raw.hero_image_public_id),
    hero_video_url: s(raw.hero_video_url) || undefined,

    goal_amount: toNumber(raw.goal_amount),
    collected_amount: toNumber(raw.collected_amount),

    donor_count: toNumber(raw.donor_count),
    prayer_count: toNumber(raw.prayer_count),

    status: s(raw.status),

    stories: [],
  };
}

function normalizeStories(
  campaignId: string,
  stories: RawStory[]
): CampaignStorySection[] {
  return stories
    .filter((row) => s(row.campaign_id) === campaignId)
    .map((row) => ({
      id: s(row.id),
      campaign_id: s(row.campaign_id),
      type: s(row.type) || "text",
      content: s(row.content) || undefined,
      image_id: s(row.image_id) || undefined,
      video_url: s(row.video_url) || undefined,
      section_order: Number(row.section_order ?? 0),
    }))
    .sort((a, b) => a.section_order - b.section_order);
}

/* =========================
   BUILDER
========================= */

function buildCampaign(
  raw: RawCampaign,
  stories: RawStory[],
  orgs: RawOrganization[]
): Campaign {
  const campaign = normalizeCampaign(raw);

  /* ORGANIZATION */
  if (campaign.organization_id) {
    const org = orgs.find(
      (o) => s(o.id) === campaign.organization_id
    );

    if (org) {
      campaign.organization = normalizeOrganization(org);
    }
  }

  /* STORIES */
  campaign.stories = normalizeStories(
    campaign.id,
    stories
  );

  return campaign;
}

/* =========================
   MAIN API
========================= */

export async function getCampaignBySlug(
  slug: string
): Promise<Campaign | null> {
  if (!slug) return null;

  const { campaigns, stories, orgs } =
    await getAllSheets();

  const raw = campaigns.find(
    (c) =>
      s(c.slug) === slug &&
      s(c.status).toLowerCase() === "active"
  );

  if (!raw) return null;

  return buildCampaign(raw, stories, orgs);
}

export async function getCampaignById(
  id: string
): Promise<Campaign | null> {
  if (!id) return null;

  const { campaigns, stories, orgs } =
    await getAllSheets();

  const raw = campaigns.find(
    (c) =>
      s(c.id) === id &&
      s(c.status).toLowerCase() === "active"
  );

  if (!raw) return null;

  return buildCampaign(raw, stories, orgs);
}