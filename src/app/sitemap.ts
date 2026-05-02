// app/sitemap.ts

import { MetadataRoute } from "next"
import { CATEGORY_MAP } from "@/lib/category"
import { getSheetsClient } from "@/lib/google-sheet-client"

export const dynamic = "force-dynamic"

const baseUrl = "https://donasi.grahadhuafa.org"

/* =========================================================
   🔥 GET CAMPAIGNS (DYNAMIC)
========================================================= */

async function getCampaignSlugs(): Promise<string[]> {
  try {
    const sheets = getSheetsClient()

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID as string,
      range: "campaigns!A:Z",
    })

    const rows: string[][] = res.data.values ?? []

    const slugs: string[] = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]

      const slug = row[2] // slug column

      if (slug) {
        slugs.push(slug)
      }
    }

    return slugs
  } catch (err) {
    console.error("SITEMAP CAMPAIGN ERROR:", err)
    return []
  }
}

/* =========================================================
   🔥 MAIN SITEMAP
========================================================= */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  /* ================= STATIC ================= */
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ]

  /* ================= CATEGORY ================= */
  const categoryUrls: MetadataRoute.Sitemap = Object.values(CATEGORY_MAP).map(
    (c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  )

  /* ================= CAMPAIGN ================= */
  const campaignSlugs = await getCampaignSlugs()

  const campaignUrls: MetadataRoute.Sitemap = campaignSlugs.map((slug) => ({
    url: `${baseUrl}/campaign/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }))

  /* ================= MERGE ================= */
  return [...staticUrls, ...categoryUrls, ...campaignUrls]
}