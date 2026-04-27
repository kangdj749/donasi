"use client"

import { useEffect, useState } from "react"

type Profile = {
  name?: string
  phone?: string
  bankName?: string
  bankAccount?: string
  bankHolder?: string
}

type Props = {
  initial: Profile | null
}

type FormState = {
  name: string
  phone: string
  bankName: string
  bankAccount: string
  bankHolder: string
}

export default function ProfileSection({ initial }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    bankHolder: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ================= SYNC INITIAL DATA ================= */

  useEffect(() => {
    if (!initial) return

    setForm({
      name: initial.name || "",
      phone: initial.phone || "",
      bankName: initial.bankName || "",
      bankAccount: initial.bankAccount || "",
      bankHolder: initial.bankHolder || "",
    })
  }, [initial])

  /* ================= UPDATE FIELD ================= */

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  /* ================= CLEAN PAYLOAD ================= */
  // 🔥 jangan kirim field kosong → biar backend gak overwrite

  function buildPayload(): Partial<FormState> {
    const payload: Partial<FormState> = {}

    if (form.name.trim()) payload.name = form.name.trim()
    if (form.phone.trim()) payload.phone = form.phone.trim()
    if (form.bankName.trim()) payload.bankName = form.bankName.trim()
    if (form.bankAccount.trim()) payload.bankAccount = form.bankAccount.trim()
    if (form.bankHolder.trim()) payload.bankHolder = form.bankHolder.trim()

    return payload
  }

  /* ================= SAVE ================= */

  async function handleSave() {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const payload = buildPayload()

      const res = await fetch("/api/affiliate/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const text = await res.text()

      let json: { error?: string } = {}
      try {
        json = JSON.parse(text)
      } catch {
        console.error("❌ INVALID JSON:", text)
      }

      if (!res.ok) {
        setError(json.error || "Gagal menyimpan profil")
        return
      }

      setSuccess(true)

      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err)
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */

  return (
    <div className="card p-6 space-y-6 animate-fadeIn">

      {/* ================= HEADER ================= */}
      <div>
        <h3 className="h3">Profil Fundraiser</h3>
        <p className="caption">
          Data ini digunakan untuk komunikasi dan pencairan komisi
        </p>
      </div>

      {/* ================= STATUS ================= */}
      {success && (
        <div className="text-sm px-3 py-2 rounded-md bg-[rgb(var(--color-primary)/0.1)] text-[rgb(var(--color-primary))]">
          Profil berhasil disimpan
        </div>
      )}

      {error && (
        <div className="text-sm px-3 py-2 rounded-md bg-red-100 text-red-600">
          {error}
        </div>
      )}

      {/* ================= BASIC INFO ================= */}
      <div className="space-y-3">
        <p className="caption-subtle">Informasi Dasar</p>

        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Nama lengkap"
          className="w-full border border-[rgb(var(--color-border))] rounded-[var(--radius-md)] px-3 py-2 bg-[rgb(var(--color-surface))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        />

        <input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Nomor HP"
          className="w-full border border-[rgb(var(--color-border))] rounded-[var(--radius-md)] px-3 py-2 bg-[rgb(var(--color-surface))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        />
      </div>

      {/* ================= BANK INFO ================= */}
      <div className="space-y-3">
        <p className="caption-subtle">Rekening Pencairan</p>

        <input
          value={form.bankName}
          onChange={(e) => update("bankName", e.target.value)}
          placeholder="Nama Bank (BCA, BRI, dll)"
          className="w-full border border-[rgb(var(--color-border))] rounded-[var(--radius-md)] px-3 py-2 bg-[rgb(var(--color-surface))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        />

        <input
          value={form.bankAccount}
          onChange={(e) => update("bankAccount", e.target.value)}
          placeholder="Nomor Rekening"
          className="w-full border border-[rgb(var(--color-border))] rounded-[var(--radius-md)] px-3 py-2 bg-[rgb(var(--color-surface))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        />

        <input
          value={form.bankHolder}
          onChange={(e) => update("bankHolder", e.target.value)}
          placeholder="Nama Pemilik Rekening"
          className="w-full border border-[rgb(var(--color-border))] rounded-[var(--radius-md)] px-3 py-2 bg-[rgb(var(--color-surface))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
        />
      </div>

      {/* ================= ACTION ================= */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </div>
  )
}