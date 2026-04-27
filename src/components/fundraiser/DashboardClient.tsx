"use client"

import { useEffect, useMemo, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Copy, Check, LogOut, Wallet } from "lucide-react"
import ProfileSection from "@/components/fundraiser/ProfileSection"
/* ================= TYPES ================= */

type Props = {
  session: {
    id: string
    name: string
    refCode: string
  }
}

type Summary = {
  totalEarning: number
  totalAmount: number
  totalConversion: number
  chart: { date: string; value: number }[]
}

type Campaign = {
  id: string
  title: string
  slug: string
}

type Profile = {
  name: string
  phone: string
  bankName: string
  bankAccount: string
  bankHolder: string
}

/* ================= COMPONENT ================= */

export default function DashboardClient({ session }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState("")

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch("/api/affiliate/summary", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        const d = res.data || {}

        setSummary({
          totalEarning: Number(d.totalEarning || 0),
          totalAmount: Number(d.totalAmount || 0),
          totalConversion: Number(d.totalConversion || 0),
          chart: Array.isArray(d.chart) ? d.chart : [],
        })
      })

    fetch("/api/affiliate/campaigns", { credentials: "include" })
      .then((r) => r.json())
      .then((res) => setCampaigns(res.data || []))

    fetch("/api/affiliate/profile", { credentials: "include" })
      .then(async (r) => {
        const text = await r.text()

        try {
          return JSON.parse(text)
        } catch {
          console.error("❌ INVALID JSON:", text)
          return { data: null }
        }
      })
      .then((res) => setProfile(res.data || null))
  }, [])

  /* ================= HELPERS ================= */

  function formatRp(n: number) {
    return new Intl.NumberFormat("id-ID").format(n || 0)
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/campaign/${slug}?ref=${session.refCode}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 1500)
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/fundraiser/login"
  }

  async function submitWithdraw() {
    const amount = Number(withdrawAmount)
    if (!amount) return alert("Masukkan nominal")

    const res = await fetch("/api/affiliate/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount }),
    })

    const json = await res.json()

    if (!res.ok) return alert(json.error || "Gagal")

    alert("Permintaan withdraw berhasil")
    setWithdrawAmount("")
  }

  /* ================= DERIVED ================= */

  const chartData = useMemo(() => {
    return (summary?.chart || []).map((d) => ({
      date: d.date,
      value: Number(d.value || 0),
    }))
  }, [summary])

  /* ================= LOADING ================= */

  if (!summary) {
    return (
      <div className="container-main py-10 animate-pulse space-y-4">
        <div className="h-6 w-40 bg-[rgb(var(--color-border))] rounded" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded bg-[rgb(var(--color-border))]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container-main py-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="h2">Halo, {session.name}</h1>
          <p className="caption">
            Ref: <span className="text-primary">{session.refCode}</span>
          </p>
        </div>

        <button onClick={logout} className="btn btn-outline flex gap-2">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <Stat title="Komisi" value={`Rp ${formatRp(summary.totalEarning)}`} />
        <Stat title="Donasi" value={`Rp ${formatRp(summary.totalAmount)}`} />
        <Stat title="Konversi" value={`${summary.totalConversion}`} />
      </div>

      {/* CHART */}
      <div className="card p-6">
        <h3 className="h3 mb-4">Performa Donasi</h3>

        <div className="h-[260px]">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => {
                  const d = new Date(v)
                  return isNaN(d.getTime())
                    ? "-"
                    : d.toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })
                }}
              />
              <Tooltip
                formatter={(v) =>
                  `Rp ${formatRp(Number(v || 0))}`
                }
              />
              <Line dataKey="value" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CAMPAIGN */}
      <div className="card p-6 space-y-3">
        <h3 className="h3">Campaign Kamu</h3>

        {campaigns.map((c) => (
          <div key={c.id} className="flex justify-between items-center">
            <div>
              <p>{c.title}</p>
              <p className="caption">/campaign/{c.slug}</p>
            </div>

            <button
              onClick={() => copyLink(c.slug)}
              className="btn btn-outline flex gap-2"
            >
              {copiedSlug === c.slug ? <Check size={16} /> : <Copy size={16} />}
              {copiedSlug === c.slug ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      {/* PROFILE */}
      <ProfileSection initial={profile} />
      

      {/* WITHDRAW */}
      <div className="card p-6 space-y-3">
        <h3 className="h3 flex items-center gap-2">
          <Wallet size={18} /> Tarik Dana
        </h3>

        <input
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Nominal"
          className="w-full border p-2 rounded"
        />

        <button onClick={submitWithdraw} className="btn btn-primary">
          Ajukan Withdraw
        </button>
      </div>

    </div>
  )
}

/* ================= STAT ================= */

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="caption">{title}</p>
      <h2 className="text-xl font-semibold mt-1">{value}</h2>
    </div>
  )
}