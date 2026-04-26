"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

type LoginResponse = {
  success?: boolean
  error?: string
  data?: {
    id: string
    name: string
    refCode: string
  }
}

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // 🔥 penting
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data: LoginResponse = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login gagal")
      }

      /* =====================================================
         🔥 FIX UTAMA: kasih delay + hard navigation
      ===================================================== */

      await new Promise((resolve) => setTimeout(resolve, 300))

      window.location.replace("/fundraiser/dashboard")

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Terjadi kesalahan")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg))] px-4">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px]"
      >

        <div className="card p-6 md:p-8 space-y-6">

          {/* HEADER */}
          <div className="space-y-2 text-center">
            <h1 className="h2">Masuk Fundraiser</h1>
            <p className="caption">
              Gunakan No. WhatsApp atau Email
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-[13px] text-red-500 text-center">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* IDENTIFIER */}
            <div className="space-y-1">
              <label className="caption">
                No. WhatsApp / Email
              </label>
              <input
                type="text"
                name="identifier"
                required
                autoComplete="username"
                value={form.identifier}
                onChange={handleChange}
                placeholder="628xxx / email@email.com"
                className="
                  w-full px-3 py-2
                  rounded-[var(--radius-md)]
                  border border-[rgb(var(--color-border))]
                  bg-[rgb(var(--color-surface))]
                  text-[rgb(var(--color-text))]
                  focus:outline-none
                  focus:border-[rgb(var(--color-primary))]
                  focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20
                "
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="caption">Password</label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="
                  w-full px-3 py-2
                  rounded-[var(--radius-md)]
                  border border-[rgb(var(--color-border))]
                  bg-[rgb(var(--color-surface))]
                  text-[rgb(var(--color-text))]
                  focus:outline-none
                  focus:border-[rgb(var(--color-primary))]
                  focus:ring-2 focus:ring-[rgb(var(--color-primary))]/20
                "
              />
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="text-center text-[13px] text-[rgb(var(--color-muted))]">
            Belum punya akun?{" "}
            <Link
              href="/fundraiser/register"
              className="text-[rgb(var(--color-primary))] font-medium hover:underline"
            >
              Daftar di sini
            </Link>
          </div>

        </div>

      </motion.div>
    </section>
  )
}