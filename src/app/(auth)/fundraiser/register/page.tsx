"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type FormState = {
  name: string
  email: string
  phone: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
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

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Gagal register")
      }

      router.push("/fundraiser/dashboard")
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
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg))] px-4">

      <div className="w-full max-w-[420px]">

        <div className="mb-8 text-center">
          <h1 className="h1 mb-2">
            Jadi Fundraiser 🚀
          </h1>
          <p className="caption">
            Bangun impact & dapatkan komisi dari setiap donasi.
          </p>
        </div>

        <div className="card space-y-5">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <Input label="Nama Lengkap" name="name" value={form.name} onChange={handleChange} required />

            {/* PHONE */}
            <Input
              label="No. WhatsApp"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="628xxxx"
            />

            {/* EMAIL (OPTIONAL) */}
            <Input
              label="Email (opsional)"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
            />

            {/* PASSWORD */}
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && (
              <div className="text-[12px] text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>

          </form>

          <div className="text-center text-[12px] text-[rgb(var(--color-muted))]">
            Sudah punya akun?{" "}
            <a
              href="/fundraiser/login"
              className="text-[rgb(var(--color-primary))] hover:underline"
            >
              Login di sini
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ================= REUSABLE INPUT ================= */

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div className="space-y-1">
      <label className="caption">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full px-3 py-2
          rounded-[var(--radius-md)]
          border border-[rgb(var(--color-border))]
          bg-[rgb(var(--color-surface))]
          text-[rgb(var(--color-text))]
          focus:outline-none
          focus:border-[rgb(var(--color-primary))]
        "
      />
    </div>
  )
}