import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-session"
import { updateAffiliateProfile } from "@/lib/google-sheet-service"

export async function POST(req: Request) {
  try {
    const user = await getSession()

    console.log("👤 UPDATE USER:", user)

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    console.log("📩 UPDATE BODY:", body)

    await updateAffiliateProfile(user.id, {
      name: body.name,
      phone: body.phone,
      bankName: body.bankName,
      bankAccount: body.bankAccount,
      bankHolder: body.bankHolder,
    })

    return NextResponse.json({
      success: true,
    })
  } catch (err) {
    console.error("🔥 UPDATE PROFILE ERROR:", err)

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}