import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth-session"
import DashboardClient from "@/components/fundraiser/DashboardClient"

export default async function DashboardPage() {
  const session = await getSession()

  /* 🔥 GUARD */
  if (!session) {
    redirect("/fundraiser/login")
  }

  /* 🔥 PASS TO CLIENT */
  return <DashboardClient session={session} />
}