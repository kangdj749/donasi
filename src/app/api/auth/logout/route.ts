import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ success: true })

  res.cookies.set("fundraiser_session", "", {
    path: "/",
    expires: new Date(0), // 🔥 force delete
  })

  console.log("👋 LOGOUT SUCCESS")

  return res
}