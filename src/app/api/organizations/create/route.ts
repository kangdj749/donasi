import { NextResponse } from "next/server"
import {
  createSpreadsheet,
  copyTemplate,
  shareSpreadsheet,
} from "@/lib/google-drive"
import { appendSheetRow } from "@/lib/google-sheet"

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()

    /* ================= TYPE SAFE PARSE ================= */
    if (
      typeof body !== "object" ||
      body === null ||
      !("name" in body) ||
      !("slug" in body)
    ) {
      return NextResponse.json(
        { error: "invalid payload" },
        { status: 400 }
      )
    }

    const { name, slug } = body as {
      name: string
      slug: string
    }

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name & slug required" },
        { status: 400 }
      )
    }

    /* ================= ENV VALIDATION ================= */
    const TEMPLATE_ID = process.env.GOOGLE_TEMPLATE_SHEET_ID

    if (!TEMPLATE_ID) {
      console.error("❌ GOOGLE_TEMPLATE_SHEET_ID not set")
      return NextResponse.json(
        { error: "server misconfigured" },
        { status: 500 }
      )
    }

    /* ================= CREATE SHEET ================= */
    const sheetId = await createSpreadsheet(
      `ORG-${slug}-DONATION`
    )

    if (!sheetId) {
      throw new Error("Failed to create spreadsheet")
    }

    /* ================= COPY TEMPLATE ================= */
    await copyTemplate(TEMPLATE_ID, sheetId)

    /* ================= SHARE ================= */
    await shareSpreadsheet(sheetId)

    /* ================= SAVE ================= */
    await appendSheetRow("organizations!A:K", [
      `ORG-${Date.now()}`,
      slug,
      name,
      "yayasan",
      "",
      "",
      "",
      "active",
      "",
      new Date().toISOString(),
      sheetId,
    ])

    return NextResponse.json({
      success: true,
      sheetId,
    })
  } catch (err) {
    console.error("❌ CREATE ORG ERROR:", err)

    return NextResponse.json(
      { error: "failed create org" },
      { status: 500 }
    )
  }
}