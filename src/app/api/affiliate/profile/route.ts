import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-session"
import { getSheetsClient } from "@/lib/google-sheet-client"
import { updateAffiliateProfile } from "@/lib/google-sheet-service"

export const dynamic = "force-dynamic"

const SHEET_ID = process.env.GOOGLE_SHEET_ID as string

type SheetRow = string[]

type Body = {
  name?: string
  phone?: string
  bankName?: string
  bankAccount?: string
  bankHolder?: string
}

/* ================= GET ================= */

export async function GET() {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sheets = getSheetsClient()

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "affiliates!A:Q",
    })

    const rows: SheetRow[] = res.data.values ?? []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]

      if (String(row[0]) === String(user.id)) {
        return NextResponse.json({
          success: true,
          data: {
            name: row[2] ?? "",
            phone: row[4] ?? "",
            bankName: row[13] ?? "",
            bankAccount: row[14] ?? "",
            bankHolder: row[15] ?? "",
          },
        })
      }
    }

    return NextResponse.json({ success: true, data: null })
  } catch (err) {
    console.error("PROFILE GET ERROR:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: Body = await req.json()

    if (
      !body.name &&
      !body.phone &&
      !body.bankName &&
      !body.bankAccount &&
      !body.bankHolder
    ) {
      return NextResponse.json(
        { error: "NO_DATA_TO_UPDATE" },
        { status: 400 }
      )
    }

    await updateAffiliateProfile(user.id, body)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}