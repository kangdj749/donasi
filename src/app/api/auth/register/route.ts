import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

import { getSheetsClient } from "@/lib/google-sheet-client"

export const dynamic = "force-dynamic"

/* ================= CONFIG ================= */

const SHEET_ID = process.env.GOOGLE_SHEET_ID as string
const SHEET_NAME = "affiliates"

/* ================= HELPERS ================= */

function generateRefCode(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 6)

  const rand = Math.floor(100 + Math.random() * 900)

  return `${base}${rand}`
}

function hashPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex")
}

/* 🔥 CORE FIX */
function normalizePhone(phone: string): string {
  let p = phone.replace(/\D/g, "")

  if (p.startsWith("0")) {
    p = "62" + p.slice(1)
  }

  if (p.startsWith("8")) {
    p = "62" + p
  }

  if (p.startsWith("62")) {
    return p
  }

  return p
}

/* ================= HANDLER ================= */

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
        name: rawName,
        email: rawEmail,
        phone: rawPhone,
        password,
        organizationId,
        }: {
        name?: string
        email?: string
        phone?: string
        password?: string
        organizationId?: string
        } = body

        /* ================= NORMALIZE INPUT ================= */

        const name = rawName?.trim()
        const email = rawEmail?.trim().toLowerCase()
        const phone = rawPhone?.trim()

    
    /* ================= VALIDATION ================= */

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: "Nama, No. WhatsApp, dan Password wajib diisi" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      )
    }

    const normalizedPhone = normalizePhone(phone)

    if (!normalizedPhone.startsWith("62")) {
      return NextResponse.json(
        { error: "Format nomor WhatsApp tidak valid" },
        { status: 400 }
      )
    }

    const sheets = getSheetsClient()

    /* ================= CHECK EXISTING ================= */

    const existingRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:N`,
    })

    const rows = existingRes.data.values ?? []

    for (let i = 1; i < rows.length; i++) {
      const rowEmail = (rows[i][3] || "").toLowerCase()
      const rowPhoneRaw = rows[i][4] || ""
      const rowPhone = normalizePhone(rowPhoneRaw)

      /* 🔥 EMAIL DUPLICATE */
      if (email && rowEmail === email) {
        return NextResponse.json(
          { error: "Email sudah terdaftar" },
          { status: 400 }
        )
      }

      /* 🔥 PHONE DUPLICATE (FIX UTAMA) */
      if (rowPhone === normalizedPhone) {
        return NextResponse.json(
          { error: "Nomor WhatsApp sudah terdaftar" },
          { status: 400 }
        )
      }
    }

    /* ================= CREATE DATA ================= */

    const id = uuidv4()
    const refCode = generateRefCode(name)
    const passwordHash = hashPassword(password)

    const now = new Date().toISOString()

    const values = [
      id,
      organizationId ?? "",
      name,
      email ?? "",
      normalizedPhone, // 🔥 FIX: SIMPAN NORMALIZED
      refCode,
      "personal",
      "active",
      passwordHash,
      "0", // total_earning
      "0", // total_conversion
      "",  // last_login_at
      now,
    ]

    /* ================= INSERT ================= */

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:N`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    })

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      success: true,
      data: {
        id,
        name,
        email,
        phone: normalizedPhone,
        refCode,
      },
    })
  } catch (err) {
    console.error("REGISTER ERROR:", err)

    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}