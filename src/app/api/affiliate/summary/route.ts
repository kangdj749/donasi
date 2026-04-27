import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-session"
import { getSheetsClient } from "@/lib/google-sheet-client"

export const dynamic = "force-dynamic"

const SHEET_ID = process.env.GOOGLE_SHEET_ID as string

/* ======================================================
   🧠 HELPERS (OUTSIDE LOOP - PERFORMANCE SAFE)
====================================================== */

function toNumber(val: unknown): number {
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

function parseDate(input: unknown): string {
  if (!input) return new Date().toISOString().slice(0, 10)

  const d = new Date(String(input))

  if (isNaN(d.getTime())) {
    console.warn("⚠️ INVALID DATE:", input)

    // 🔥 fallback ke hari ini (biar chart gak hilang)
    return new Date().toISOString().slice(0, 10)
  }

  return d.toISOString().slice(0, 10)
}

/* ======================================================
   🚀 ROUTE
====================================================== */

export async function GET() {
  try {
    /* ================= AUTH ================= */
    const user = await getSession()

    if (!user?.id) {
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

    const rows: string[][] = res.data.values ?? []

    /* ================= INIT ================= */
    let totalAmount = 0
    let totalEarning = 0
    let totalConversion = 0

    const chartMap: Record<string, number> = {}

    /* ================= LOOP ================= */
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (!row) continue

      const affiliateId = row[2]
      if (!affiliateId || affiliateId !== user.id) continue

      const amount = toNumber(row[4])
      const commission = toNumber(row[5])
      const createdAt = row[6]

      totalAmount += amount
      totalEarning += commission
      totalConversion++

      /* 🔥 PARSE DATE (STRICT) */
      const date = parseDate(createdAt)

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
        totalEarning,
        totalConversion,
        conversionRate:
          totalConversion > 0
            ? totalEarning / totalConversion
            : 0,
        chart,
      },
    })
  } catch (err) {
    console.error("🔥 SUMMARY ERROR:", err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}