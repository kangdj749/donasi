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
  onSaved?: () => void
  onCancel?: () => void
}

type FormState = {
  name: string
  phone: string
  bankName: string
  bankAccount: string
  bankHolder: string
}

export default function ProfileSection({
  initial,
  onSaved,
  onCancel,
}: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    bankHolder: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initial) return

    setForm({
      name: initial.name ?? "",
      phone: initial.phone ?? "",
      bankName: initial.bankName ?? "",
      bankAccount: initial.bankAccount ?? "",
      bankHolder: initial.bankHolder ?? "",
    })
  }, [initial])

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/affiliate/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error || "Gagal menyimpan")
        return
      }

      onSaved?.()
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      <input
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="Nama"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
        placeholder="No HP"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        value={form.bankName}
        onChange={(e) => update("bankName", e.target.value)}
        placeholder="Bank"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        value={form.bankAccount}
        onChange={(e) => update("bankAccount", e.target.value)}
        placeholder="No Rekening"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        value={form.bankHolder}
        onChange={(e) => update("bankHolder", e.target.value)}
        placeholder="Atas Nama"
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="btn btn-primary flex-1"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>

        <button
          onClick={onCancel}
          className="btn btn-outline flex-1"
        >
          Batal
        </button>
      </div>
    </div>
  )
}