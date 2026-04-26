import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-session"
import { getSheetsClient } from "@/lib/google-sheet-client"

export const dynamic = "force-dynamic"

const SHEET_ID = process.env.GOOGLE_SHEET_ID as string

export async function GET() {
  try {
    /* ================= AUTH ================= */
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const sheets = getSheetsClient()

    /* ================= GET DATA ================= */
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "commissions!A:H",
    })

    const rows = res.data.values ?? []

    /* ================= INIT ================= */
    let totalAmount = 0
    let totalEarning = 0 // 🔥 rename dari totalCommission
    let totalConversion = 0

    const chartMap: Record<string, number> = {}

    /* ================= LOOP ================= */
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]

      const affiliateId = row[2] || ""
      if (affiliateId !== user.id) continue

      const amount = Number(row[4] || 0)
      const commission = Number(row[5] || 0)
      const createdAt = row[6]

      totalAmount += amount
      totalEarning += commission
      totalConversion++

      /* 🔥 SAFE DATE */
      let date = "unknown"

      try {
        date = new Date(createdAt)
          .toISOString()
          .slice(0, 10)
      } catch {
        // ignore invalid date
      }

      chartMap[date] = (chartMap[date] || 0) + amount
    }

    /* ================= CHART FORMAT ================= */
    const chart = Object.entries(chartMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({
        date,
        value,
      }))

    /* ================= RESPONSE ================= */
    return NextResponse.json({
      success: true,
      data: {
        totalAmount,
        totalEarning, // 🔥 ini yg dipakai frontend
        totalConversion,
        conversionRate:
          totalConversion > 0
            ? totalEarning / totalConversion
            : 0,
        chart,
      },
    })
  } catch (err) {
    console.error("SUMMARY ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}