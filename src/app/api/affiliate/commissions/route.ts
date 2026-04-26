import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { getSheetsClient } from "@/lib/google-sheet-client"

export async function GET() {
  const user = getSessionUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const sheets = getSheetsClient()

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "commissions!A:H",
  })

  const rows = res.data.values ?? []

  const data = []

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]

    if (r[2] !== user.id) continue

    data.push({
      donationId: r[1],
      amount: Number(r[4]),
      commission: Number(r[5]),
      date: r[6],
    })
  }

  return NextResponse.json({ success: true, data })
}