import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-session"
import { getSheetsClient } from "@/lib/google-sheet-client"

export const dynamic = "force-dynamic"

const SHEET_ID = process.env.GOOGLE_SHEET_ID as string

export async function GET() {
  try {
    console.log("\n==============================")
    console.log("📊 GET AFFILIATE CAMPAIGNS")

    /* ================= AUTH ================= */
    const user = await getSession()

    if (!user) {
      console.log("❌ UNAUTHORIZED")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("👤 USER:", user.id)

    const sheets = getSheetsClient()

    /* ================= GET COMMISSIONS ================= */
    const commRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "commissions!A:K",
    })

    const commRows = commRes.data.values ?? []

    console.log("📦 TOTAL COMMISSIONS:", commRows.length)

    /* ================= EXTRACT CAMPAIGN IDS ================= */
    const campaignSet = new Set<string>()

    for (let i = 1; i < commRows.length; i++) {
      const row = commRows[i]

      const affiliateId = row[2] || ""
      const campaignId = row[3] || ""

      if (affiliateId === user.id && campaignId) {
        campaignSet.add(String(campaignId))
      }
    }

    const campaignIds = Array.from(campaignSet)

    console.log("🎯 CAMPAIGN IDS:", campaignIds)

    if (campaignIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    /* ================= GET CAMPAIGNS ================= */
    const campRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "campaigns!A:Z",
    })

    const campRows = campRes.data.values ?? []

    const campaigns: {
      id: string
      title: string
      slug: string
    }[] = []

    for (let i = 1; i < campRows.length; i++) {
      const row = campRows[i]

      const id = String(row[0] || "")
      const slug = row[2] || ""
      const title = row[3] || ""

      if (campaignIds.includes(id)) {
        campaigns.push({
          id,
          title,
          slug,
        })
      }
    }

    /*console.log("✅ RESULT:", campaigns.length) */

    return NextResponse.json({
      success: true,
      data: campaigns,
    })
  } catch (err) {
    console.error("🔥 CAMPAIGNS API ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}