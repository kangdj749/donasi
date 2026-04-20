import { NextResponse } from "next/server";
import { google } from "googleapis";

/* ================= CONFIG ================= */

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const DONATION_SHEET = "donations";
const CAMPAIGN_SHEET = "campaigns";

/* ================= AUTH ================= */

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

/* ================= TYPES ================= */

type PaymentStatus = "pending" | "paid" | "failed" | "expired";

/* ================= HANDLER ================= */

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const donationId = params.id?.trim();

    if (!donationId) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    /* ================= GET DONATIONS ================= */

    const donationRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${DONATION_SHEET}!A:Z`,
    });

    const donationRows = donationRes.data.values ?? [];

    const donation = donationRows.find(
      (row) => row[0]?.toString().trim() === donationId
    );

    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    /*
      STRUCTURE (FIXED):
      0 id
      1 campaign_id
      7 amount
      9 payment_status ✅
      12 message
      14 created_at
      20 campaign_slug
      21 src
    */

    const campaignId = donation[1]?.toString();
    const amount = Number(donation[7] || 0);
    const payment_status =
      (donation[9] as PaymentStatus) || "pending";

    /* ================= GET CAMPAIGN ================= */

    let campaignData = null;

    if (campaignId) {
      const campaignRes = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `${CAMPAIGN_SHEET}!A:Z`,
      });

      const campaignRows = campaignRes.data.values ?? [];

      const campaign = campaignRows.find(
        (row) => row[0]?.toString().trim() === campaignId
      );

      if (campaign) {
        campaignData = {
          title: campaign[3] ?? "",
          slug: campaign[2], // 🔥 tambahin ini (kolom slug)
          collected_amount: Number(campaign[9] || 0),
          target_amount: Number(campaign[8] || 0),
        };
      }
    }

    /* ================= RESPONSE ================= */

    return NextResponse.json({
      payment_status,
      amount,
      campaign: campaignData,

      // optional (biar gak error di FE)
      va_number: null,
      bank: null,
      expiry_time: null,
    });
  } catch (error) {
    console.error("STATUS API ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}