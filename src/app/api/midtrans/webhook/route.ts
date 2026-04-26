import { NextResponse } from "next/server"
import crypto from "crypto"

import { processAffiliateCommission } from "@/lib/affiliate.service"

import {
  updateDonationStatus,
  incrementCampaignStats,
  getDonationRaw,
} from "@/lib/google-sheet-service"

export const dynamic = "force-dynamic"

/* ================= TYPES ================= */

type MidtransPayload = {
  order_id: string
  status_code: string
  gross_amount: string
  signature_key?: string
  transaction_status: string
  transaction_id: string
}

/* ================= HELPERS ================= */

function verifySignature(payload: MidtransPayload): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY

  if (!serverKey || !payload.signature_key) return false

  const raw =
    payload.order_id +
    payload.status_code +
    payload.gross_amount +
    serverKey

  const hash = crypto
    .createHash("sha512")
    .update(raw)
    .digest("hex")

  return hash === payload.signature_key
}

function mapStatus(status: string): string {
  if (["capture", "settlement"].includes(status)) return "paid"
  if (status === "pending") return "pending"
  if (["deny", "cancel"].includes(status)) return "failed"
  if (status === "expire") return "expired"
  return "pending"
}

/* ================= HANDLER ================= */

export async function POST(req: Request) {
  try {
    const payload: MidtransPayload = await req.json()

    console.log("\n==============================")
    console.log("📩 WEBHOOK IN:", payload.order_id)
    console.log("📊 STATUS:", payload.transaction_status)

    /* ================= SECURITY ================= */

    if (process.env.NODE_ENV === "production") {
      const valid = verifySignature(payload)

      if (!valid) {
        console.error("❌ INVALID SIGNATURE:", payload.order_id)
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 403 }
        )
      }
    }

    /* ================= GET DONATION ================= */

    const donation = await getDonationRaw(payload.order_id)

    if (!donation) {
      console.error("❌ DONATION NOT FOUND:", payload.order_id)
      return NextResponse.json({ received: true })
    }

    console.log("📦 DONATION DATA:", donation)

    const newStatus = mapStatus(payload.transaction_status)
    const wasPaid = donation.payment_status === "paid"

    console.log("🔄 STATUS CHANGE:", {
      from: donation.payment_status,
      to: newStatus,
    })

    /* ================= UPDATE STATUS ================= */

    await updateDonationStatus(payload.order_id, {
      payment_status: newStatus,
      midtrans_id: payload.transaction_id,
    })

    /* ================= IDEMPOTENCY ================= */

    if (wasPaid) {
      console.log("⚠️ ALREADY PAID → SKIP")
      return NextResponse.json({ received: true })
    }

    if (newStatus !== "paid") {
      console.log("⏳ NOT PAID → SKIP")
      return NextResponse.json({ received: true })
    }

    /* ================= PAYMENT SUCCESS ================= */

    console.log("💰 PAYMENT SUCCESS:", payload.order_id)

    /* ================= UPDATE CAMPAIGN ================= */

    await incrementCampaignStats(
      String(donation.campaign_id),
      Number(donation.amount || 0)
    )

    /* ================= RESOLVE REF CODE ================= */

    const refCode =
      donation.ref_code || // 🔥 PRIORITAS
      donation.ref ||      // fallback lama
      ""

    console.log("🔗 REF RESOLVED:", {
      ref_code: donation.ref_code,
      ref: donation.ref,
      final: refCode,
    })

    if (!refCode) {
      console.log("❌ NO REF CODE → SKIP COMMISSION")
      return NextResponse.json({ received: true })
    }

    /* ================= AFFILIATE COMMISSION ================= */

    try {
      await processAffiliateCommission({
      donationId: donation.id,
      campaignId: donation.campaign_id,
      amount: Number(donation.amount || 0),

      affiliateId: donation.affiliate_id, // 🔥 INI KUNCI
      refCode, // fallback only
      src: donation.src,
    })
      console.log("🧾 DONATION AFFILIATE:", {
        affiliate_id: donation.affiliate_id,
        ref_code: donation.ref_code,
        ref: donation.ref,
      })
      console.log("💸 COMMISSION PROCESSED:", donation.id)
    } catch (err) {
      console.error("🔥 COMMISSION ERROR:", err)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("🔥 WEBHOOK ERROR:", err)

    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    )
  }
}