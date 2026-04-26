"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

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

export default function DashboardClient({ session }: Props) {
  const [data, setData] = useState<Summary | null>(null)

  useEffect(() => {
    fetch("/api/affiliate/summary", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("SUMMARY:", res)

        setData({
          totalEarning: Number(res.data?.totalEarning || 0),
          totalAmount: Number(res.data?.totalAmount || 0),
          totalConversion: Number(res.data?.totalConversion || 0),
          chart: res.data?.chart || [],
        })
      })
  }, [])

  if (!data) {
    return (
      <div className="container-main py-10">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="container-main py-8 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="h2">
            Halo, {session.name} 👋
          </h1>
          <p className="caption">
            Ref Code:{" "}
            <span className="font-medium text-[rgb(var(--color-primary))]">
              {session.refCode}
            </span>
          </p>
        </div>

        <button className="btn btn-primary">
          Share Link
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="card p-5">
          <p className="caption">Total Komisi</p>
          <h2 className="text-2xl font-bold mt-1">
            Rp {data.totalEarning.toLocaleString()}
          </h2>
        </div>

        <div className="card p-5">
          <p className="caption">Total Donasi</p>
          <h2 className="text-2xl font-bold mt-1">
            Rp {data.totalAmount.toLocaleString()}
          </h2>
        </div>

        <div className="card p-5">
          <p className="caption">Total Konversi</p>
          <h2 className="text-2xl font-bold mt-1">
            {data.totalConversion}
          </h2>
        </div>

      </div>

      {/* ================= CHART ================= */}
      <div className="card p-5">
        <div className="mb-4">
          <h3 className="font-semibold">
            Performa Donasi (Harian)
          </h3>
          <p className="caption">
            Total donasi dari link Anda
          </p>
        </div>

        {data.chart.length === 0 ? (
          <div className="text-sm text-gray-500">
            Belum ada data
          </div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ================= CTA ================= */}
      <div className="card p-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-semibold">
            Bagikan Link Anda
          </h3>
          <p className="caption">
            Ajak lebih banyak orang berdonasi
          </p>
        </div>

        <button
          onClick={() => {
            const url = `${window.location.origin}/campaign?ref=${session.refCode}`
            navigator.clipboard.writeText(url)
            alert("Link berhasil disalin")
          }}
          className="btn btn-secondary"
        >
          Copy Link
        </button>
      </div>

    </div>
  )
}