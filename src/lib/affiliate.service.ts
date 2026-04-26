import { appendSheetRow } from "@/lib/google-sheet"
import { getSheetsClient } from "@/lib/google-sheet-client"
import { getAffiliateByRefCode } from "@/lib/google-sheet-service"

const SHEET_ID = process.env.GOOGLE_SHEET_ID as string

/* ======================================================
   🎯 TYPES
====================================================== */

type Affiliate = {
  id: string
}

type Params = {
  donationId: string
  campaignId: string
  amount: number

  refCode?: string
  affiliateId?: string // 🔥 PRIORITAS (lebih cepat)
  src?: string
}

/* ======================================================
   🧠 HELPERS
====================================================== */

function parseBoolean(val: unknown): boolean {
  return String(val).toLowerCase() === "true"
}

function parseNumber(val: unknown): number {
  const n = Number(val)
  return Number.isNaN(n) ? 0 : n
}

/* ======================================================
   🚀 MAIN FUNCTION (FINAL)
====================================================== */

export async function processAffiliateCommission(
  params: Params
): Promise<void> {
  try {
    const {
      donationId,
      campaignId,
      amount,
      refCode,
      affiliateId,
      src,
    } = params

    console.log("\n==============================")
    console.log("🚀 PROCESS COMMISSION START")
    console.log("PARAMS:", params)

    /* ================= VALIDATION ================= */

    if (!donationId || !campaignId) {
      console.log("❌ INVALID PARAM")
      return
    }

    const sheets = getSheetsClient()

    /* ================= IDEMPOTENCY CHECK ================= */

    const existingRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "commissions!A:A",
    })

    const existingRows = existingRes.data.values ?? []

    const exists = existingRows.some(
      (r: string[]) => r[0] === `comm_${donationId}`
    )

    if (exists) {
      console.log("⚠️ COMMISSION ALREADY EXISTS → SKIP")
      return
    }

    /* ================= RESOLVE AFFILIATE ================= */

    let affiliate: Affiliate | null = null

    // 🔥 FAST PATH
    if (affiliateId) {
      affiliate = { id: affiliateId }
      console.log("⚡ USING affiliate_id:", affiliateId)
    }

    // 🔥 FALLBACK
    if (!affiliate && refCode) {
      const aff = await getAffiliateByRefCode(refCode)

      if (!aff) {
        console.log("❌ AFFILIATE NOT FOUND:", refCode)
        return
      }

      affiliate = { id: aff.id }
      console.log("🔗 USING refCode:", refCode)
    }

    if (!affiliate) {
      console.log("❌ NO AFFILIATE DATA")
      return
    }

    /* ================= GET CAMPAIGN ================= */

    const campaignRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "campaigns!A:Z",
    })

    const campaignRows = campaignRes.data.values ?? []

    let campaign:
      | {
          affiliateEnabled: boolean
          affiliateType: string
          affiliateValue: number
        }
      | null = null

    for (let i = 1; i < campaignRows.length; i++) {
      const row = campaignRows[i]

      if (String(row[0]) === String(campaignId)) {
        campaign = {
          affiliateEnabled: parseBoolean(row[19]),
          affiliateType: String(row[20] || ""),
          affiliateValue: parseNumber(row[21]),
        }
        break
      }
    }

    console.log("📊 CAMPAIGN:", campaign)

    if (!campaign) {
      console.log("❌ CAMPAIGN NOT FOUND")
      return
    }

    if (!campaign.affiliateEnabled) {
      console.log("⛔ AFFILIATE DISABLED")
      return
    }

    /* ================= CALCULATE ================= */

    let commission = 0

    if (campaign.affiliateType === "percent") {
      commission = Math.floor(
        amount * (campaign.affiliateValue / 100)
      )
    } else if (campaign.affiliateType === "fixed") {
      commission = campaign.affiliateValue
    }

    console.log("💰 COMMISSION:", commission)

    if (commission <= 0) {
      console.log("❌ ZERO COMMISSION")
      return
    }

    /* ================= INSERT ================= */

    const now = new Date().toISOString()

    const newRow: (string | number)[] = [
      `comm_${donationId}`,
      donationId,
      affiliate.id,
      campaignId,

      amount,
      commission,

      "pending",
      now,
      "",
      "",
      src || "",
    ]

    await appendSheetRow("commissions!A:K", newRow)

    console.log("✅ COMMISSION CREATED SUCCESS")
  } catch (err) {
    console.error("🔥 COMMISSION ERROR:", err)
  }
}