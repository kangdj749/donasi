"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useAffiliateContext } from "@/components/system/AffiliateContext"
import { CampaignProduct } from "@/lib/campaign.product.service"

type Props = {
  products: CampaignProduct[]
  onSelectDonation?: (amount: number) => void
}

function formatCurrency(val: number) {
  return `Rp ${val.toLocaleString("id-ID")}`
}

export default function CampaignProductSection({
  products,
  onSelectDonation,
}: Props) {
  const { ref, src } = useAffiliateContext()

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  /* ================= WA GENERATOR (FIX TOTAL) ================= */
  function generateWA(p: CampaignProduct) {
    const phone = (p.wa_phone || "")
      .replace(/^0/, "62")
      .replace(/\D/g, "")

    const text =
      "Assalamu'alaikum,%0A%0A" +
      "Saya ingin qurban:%0A%0A" +
      `• ${p.title}%0A` +
      `Harga: ${formatCurrency(p.price)}%0A` +
      (p.weight ? `Berat: ${p.weight}%0A` : "") +
      "%0AMohon info lanjut 🙏%0A%0A" +
      `Ref: ${ref || "-"}%0A` +
      `Source: ${src || "direct"}`

    return `https://wa.me/${phone}?text=${text}`
  }

  /* ================= SLIDER ================= */
  function scrollToIndex(index: number) {
    const container = scrollRef.current
    if (!container) return

    const child = container.children[index] as HTMLElement
    if (!child) return

    const offset =
      child.offsetLeft -
      container.offsetWidth / 2 +
      child.offsetWidth / 2

    container.scrollTo({
      left: offset,
      behavior: "smooth",
    })

    setActiveIndex(index)
  }

  useEffect(() => {
    if (products.length) {
      setTimeout(() => scrollToIndex(0), 100)
    }
  }, [products])

  if (!products.length) return null

  return (
    <section className="section-tight">
      <div className="space-y-5">

        {/* HEADER */}
        <div>
          <h2 className="h3">Pilih Hewan Qurban 🐄</h2>
          <p className="caption text-[rgb(var(--color-muted))]">
            Pilih paket terbaik atau sedekah fleksibel
          </p>
        </div>

        {/* VALUE + IMPACT */}
        <div className="space-y-3">

        {/* VALUE */}
        <div className="
            rounded-[var(--radius-lg)]
            border border-[rgb(var(--color-border))]
            bg-[rgb(var(--color-soft))]
            p-4
        ">
            <p className="caption text-[rgb(var(--color-muted))] leading-relaxed">
            💡 Harga sudah <span className="font-medium text-[rgb(var(--color-text))]">all-in</span>:
            pemeliharaan, penyembelihan, recah, hingga distribusi daging ke penerima manfaat.
            </p>
        </div>

        {/* IMPACT */}
        <div className="
            rounded-[var(--radius-lg)]
            border border-[rgb(var(--color-border))]
            bg-[rgb(var(--color-surface))]
            p-4
            flex justify-between items-center
        ">
            <div>
            <p className="caption text-[rgb(var(--color-muted))]">
                🎯 Target Qurban
            </p>
            <p className="body font-medium">
                200 Domba • 20 Sapi
            </p>
            </div>

            <div className="text-right">
            <p className="caption-subtle">Estimasi daging</p>
            <p className="body font-semibold text-[rgb(var(--color-primary))]">
                ~2200kg
            </p>
            </div>
        </div>

        </div>

        {/* SLIDER WRAPPER */}
        <div className="relative">

          {/* LEFT */}
          <button
            onClick={() =>
              scrollToIndex(Math.max(0, activeIndex - 1))
            }
            className="
              absolute -left-3 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 rounded-full
              bg-[rgb(var(--color-bg))]
              border border-[rgb(var(--color-border))]
              shadow
            "
          >
            ←
          </button>

          {/* RIGHT */}
          <button
            onClick={() =>
              scrollToIndex(
                Math.min(products.length - 1, activeIndex + 1)
              )
            }
            className="
              absolute -right-3 top-1/2 -translate-y-1/2 z-10
              w-9 h-9 rounded-full
              bg-[rgb(var(--color-bg))]
              border border-[rgb(var(--color-border))]
              shadow
            "
          >
            →
          </button>

          {/* SLIDER */}
          <div
            ref={scrollRef}
            className="
              flex gap-4
              overflow-x-auto
              snap-x snap-mandatory
              px-6
              no-scrollbar
            "
          >
            {products.map((p, i) => {
              const isActive = i === activeIndex

              return (
                <div
                  key={p.id}
                  onClick={() => scrollToIndex(i)}
                  className={`
                    snap-center shrink-0
                    w-[80%] max-w-[300px]
                    transition-all duration-300

                    ${
                      isActive
                        ? "scale-100 opacity-100"
                        : "scale-90 opacity-50"
                    }

                    rounded-[var(--radius-xl)]
                    border border-[rgb(var(--color-border))]
                    bg-[rgb(var(--color-surface))]
                    shadow-[var(--shadow-soft)]
                    overflow-hidden
                  `}
                >
                  {/* IMAGE */}
                  <div className="relative h-[160px] bg-[rgb(var(--color-soft))]">
                    {p.image?.startsWith("http") ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl">
                        🐄
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 space-y-2">

                    <h3 className="body font-semibold">
                      {p.title}
                    </h3>

                    <p className="caption text-[rgb(var(--color-muted))]">
                      {p.subtitle}
                    </p>

                    <p className="h3 text-[rgb(var(--color-primary))]">
                      {formatCurrency(p.price)}
                    </p>

                    {/* CTA */}
                    {p.type === "wa" ? (
                      <a
                        href={generateWA(p)}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-primary w-full"
                      >
                        Konsultasi
                      </a>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()

                          console.log("🔥 SELECT DONATION:", p)

                          onSelectDonation?.(p.price)
                        }}
                        className="btn btn-outline w-full"
                      >
                        Donasi Sekarang
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* DOT */}
        <div className="flex justify-center gap-1">
          {products.map((_, i) => (
            <div
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                i === activeIndex
                  ? "bg-[rgb(var(--color-primary))]"
                  : "bg-[rgb(var(--color-border))]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}