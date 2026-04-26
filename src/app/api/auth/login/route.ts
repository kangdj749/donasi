import { NextResponse } from "next/server"
import crypto from "crypto"
import { getSheetsClient } from "@/lib/google-sheet-client"

export const dynamic = "force-dynamic"

/* ================= CONFIG ================= */

const SHEET_ID = process.env.GOOGLE_SHEET_ID as string
const SHEET_NAME = "affiliates"

const COOKIE_NAME = "fundraiser_session"
const AUTH_SECRET = process.env.AUTH_SECRET!

/* ================= HELPERS ================= */

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

/* 🔥 SAME NORMALIZATION */
function normalizePhone(phone: string): string {
  let p = phone.replace(/\D/g, "")

  if (p.startsWith("0")) p = "62" + p.slice(1)
  if (p.startsWith("8")) p = "62" + p

  return p
}

/* ================= SESSION ================= */

function createSession(payload: {
  id: string
  name: string
  refCode: string
}) {
  const json = JSON.stringify(payload)

  // 🔥 gunakan base64url biar aman cookie
  const base = Buffer.from(json).toString("base64url")

  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(base)
    .digest("hex")

  return `${base}.${signature}`
}

/* ================= HANDLER ================= */

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const identifier = body.identifier as string | undefined
    const password = body.password as string | undefined

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Nomor WhatsApp / Email dan password wajib diisi" },
        { status: 400 }
      )
    }

    const cleanIdentifier = identifier.trim().toLowerCase()
    const normalizedPhone = normalizePhone(identifier)
    const passwordHash = hashPassword(password)

    const sheets = getSheetsClient()

    /* ================= FETCH ================= */

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:N`,
    })

    const rows = res.data.values ?? []

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "Data user kosong" },
        { status: 400 }
      )
    }

    /* ================= FIND USER ================= */

    let foundIndex = -1
    let user: {
      id: string
      name: string
      email: string
      phone: string
      refCode: string
      passwordHash: string
    } | null = null

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]

      const rowId = row[0] || ""
      const rowName = row[2] || ""
      const rowEmail = (row[3] || "").toLowerCase()
      const rowPhone = normalizePhone(row[4] || "")
      const rowRefCode = row[5] || ""
      const rowPasswordHash = row[8] || ""

      const match =
        cleanIdentifier === rowEmail ||
        normalizedPhone === rowPhone

      if (match) {
        foundIndex = i
        user = {
          id: rowId,
          name: rowName,
          email: rowEmail,
          phone: rowPhone,
          refCode: rowRefCode,
          passwordHash: rowPasswordHash,
        }
        break
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Akun tidak ditemukan" },
        { status: 404 }
      )
    }

    /* ================= VERIFY PASSWORD ================= */

    if (user.passwordHash !== passwordHash) {
      return NextResponse.json(
        { error: "Password salah" },
        { status: 401 }
      )
    }

    /* ================= CREATE SESSION ================= */

    const token = createSession({
      id: user.id,
      name: user.name,
      refCode: user.refCode,
    })

    /* ================= UPDATE LOGIN ================= */

    const rowNumber = foundIndex + 1
    const now = new Date().toISOString()

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!L${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[now]],
      },
    })

    /* ================= RESPONSE ================= */

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        refCode: user.refCode,
      },
    })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: false, // 🔥 WAJIB FALSE di localhost
      //secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })
    
    return response
  } catch (err) {
    console.error("LOGIN ERROR:", err)

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}