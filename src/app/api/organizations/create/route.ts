import { NextResponse } from "next/server";
import {
  createSpreadsheet,
  copyTemplate,
  shareSpreadsheet,
} from "@/lib/google-drive";
import { appendSheetRow } from "@/lib/google-sheet";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name;
    const slug = body.slug;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "invalid payload" },
        { status: 400 }
      );
    }

    /* ================= CREATE SHEET ================= */

    const sheetId = await createSpreadsheet(
      `ORG-${slug}-DONATION`
    );

    /* ================= COPY TEMPLATE ================= */

    await copyTemplate(
      process.env.GOOGLE_TEMPLATE_SHEET_ID!,
      sheetId
    );

    /* ================= SHARE ================= */

    await shareSpreadsheet(sheetId);

    /* ================= SAVE TO ORGANIZATIONS ================= */

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
      sheetId, // 🔥 IMPORTANT
    ]);

    return NextResponse.json({
      success: true,
      sheetId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "failed create org" },
      { status: 500 }
    );
  }
}