import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth-session"
import { appendSheetRow } from "@/lib/google-sheet"

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { amount } = await req.json()

  if (!amount || amount < 50000) {
    return NextResponse.json({ error: "Minimal 50rb" }, { status: 400 })
  }

  await appendSheetRow("withdrawals!A:F", [
    `wd_${Date.now()}`,
    user.id,
    amount,
    "pending",
    new Date().toISOString(),
    "",
  ])

  return NextResponse.json({ success: true })
}