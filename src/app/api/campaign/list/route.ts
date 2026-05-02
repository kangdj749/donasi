import { NextRequest, NextResponse } from "next/server"
import { getSheetsClient } from "@/lib/google-sheet-client"

export const dynamic = "force-dynamic"

const SHEET_ID = process.env.GOOGLE_SHEET_ID as string

/* ================= TYPES ================= */

type SheetRow = string[]

type Campaign = {
  id: string
  slug: string
  title: string
  shortTagline: string
  category: string[]
  image: string
  goal: number
  collected: number
  donors: number
}

/* ================= HELPERS ================= */

function toNumber(val: unknown): number {
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

/* 🔥 FIX PARSE CATEGORY */
function parseCategories(val: unknown): string[] {
  if (!val) return []

  return String(val)
    .replace(/"/g, "") // 🔥 remove quotes
    .toLowerCase()
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
}

/* 🔥 FIX STATUS */
function isActive(val: unknown): boolean {
  return String(val).trim().toLowerCase() === "active"
}

/* ================= GET ================= */

export async function GET(req: NextRequest) {
  try {
    console.log("\n📊 GET CAMPAIGN LIST")

    const { searchParams } = new URL(req.url)

    const category = searchParams.get("category")?.toLowerCase()
    const limitParam = searchParams.get("limit")

    const limit = limitParam ? Number(limitParam) : 20

    const sheets = getSheetsClient()

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "campaigns!A:Z",
    })

    const rows: SheetRow[] = res.data.values ?? []

    console.log("📦 TOTAL ROWS:", rows.length)

    if (rows.length <= 1) {
      return NextResponse.json({ success: true, data: [] })
    }

    const result: Campaign[] = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]

      /* ================= VALIDATION ================= */

      if (!isActive(row[12])) continue

      const categories = parseCategories(row[5])

      if (category && !categories.includes(category)) continue

      const campaign: Campaign = {
        id: String(row[0] || ""),
        slug: String(row[2] || ""),
        title: String(row[3] || ""),
        shortTagline: String(row[4] || ""),
        category: categories,
        image: String(row[6] || ""), // 🔥 FULL URL
        goal: toNumber(row[9]),
        collected: toNumber(row[10]),
        donors: toNumber(row[11]),
      }

      result.push(campaign)
    }

    console.log("✅ RESULT:", result.length)

    /* ================= SORT ================= */

    result.sort((a, b) => b.collected - a.collected)

    /* ================= LIMIT ================= */

    const sliced = result.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: sliced,
    })
  } catch (err) {
    console.error("🔥 CAMPAIGN LIST ERROR:", err)

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    )
  }
}