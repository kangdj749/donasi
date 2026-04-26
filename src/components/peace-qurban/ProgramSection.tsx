"use client"

import Image from "next/image"
import Link from "next/link"
import { useAffiliateContext } from "@/components/system/AffiliateContext"
import { cloudinaryImage } from "@/lib/cloudinaryImage"
import { useMemo } from "react"

type ProgramItem = {
  title: string
  subtitle: string
  icon: string
  image: string
  product?: string
  highlight?: string
}

const programs: ProgramItem[] = [
  {
    title: "Qurban Domba",
    subtitle: "Praktis untuk individu & keluarga",
    icon: "🐐",
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776554573/Jenis-hewan-kurban-domba_lz1cwn.jpg",
    product: "Qurban Domba",
    highlight: "Paling diminati",
  },
  {
    title: "Qurban Sapi",
    subtitle: "Dampak besar untuk banyak penerima",
    icon: "🐄",
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776554325/Pusat20250511-015908-jual_20sapi2_jva4nr.webp",
    product: "Qurban Sapi",
  },
  {
    title: "1/7 Sapi",
    subtitle: "Solusi patungan lebih ringan",
    icon: "👥",
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776554084/img-20250530-174010-68398ba634777c1c1278d9d3_jkunpq.jpg",
    product: "Qurban 1/7 Sapi",
  },
  {
    title: "Sedekah Qurban",
    subtitle: "Berbagi tanpa harus berqurban penuh",
    icon: "❤️",
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776553887/Mengutamakan-berqurban-atau-sedekah_bhwqwt.jpg",
  },
]

export default function ProgramSection() {
  const { ref, src } = useAffiliateContext()

  /* ================= URL BUILDER ================= */
  function buildUrl(base: string) {
    const params = new URLSearchParams()

    if (ref) params.set("ref", ref)
    if (src) params.set("src", src)

    const query = params.toString()
    return query ? `${base}?${query}` : base
  }

  /* ================= CAMPAIGN URL ================= */
  const campaignUrl = useMemo(() => {
    return buildUrl("/campaign/peace-qurban")
  }, [ref, src])

  /* ================= WA GENERATOR ================= */
  function generateWA(product: string) {
    const phone = "6281322817712"

    const message = `
Assalamu’alaikum kak 🙏

Saya tertarik ikut program:
*Peace Qurban*

Pilihan:
• ${product}

Mohon info detail & proses selanjutnya ya kak 🙏
${ref ? `\nRef: ${ref}` : ""}
${src ? `\nSource: ${src}` : ""}
${typeof window !== "undefined" ? `\nLink: ${window.location.origin + campaignUrl}` : ""}
    `

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  /* ================= UI ================= */

  return (
    <section className="relative section bg-[rgb(var(--color-bg))] overflow-hidden">

      {/* BG ACCENT */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] bg-[rgb(var(--color-primary))]/10 blur-3xl rounded-full" />
      </div>

      <div className="container-wide relative z-10">

        {/* HEADER */}
        <div className="max-w-[720px] mb-12">
          <p className="caption tracking-[0.25em] uppercase mb-4">
            PILIHAN PROGRAM
          </p>

          <h2 className="h2 mb-6">
            Pilih Qurban Terbaik Sesuai Kemampuan Anda
          </h2>

          <p className="body-lg text-[rgb(var(--color-muted))]">
            Setiap pilihan membawa dampak nyata bagi yang membutuhkan.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {programs.map((item, i) => (
            <div
              key={i}
              className="
                group relative overflow-hidden
                rounded-[var(--radius-lg)]
                border border-[rgb(var(--color-border))]
                bg-[rgb(var(--color-surface))]
                shadow-[var(--shadow-soft)]
                transition hover:shadow-[var(--shadow-medium)]
                hover:-translate-y-1
              "
            >

              {/* IMAGE */}
              <div className="relative h-[180px] overflow-hidden">
                <Image
                  src={cloudinaryImage(item.image, "card")}
                  alt={item.title}
                  fill
                  className="object-cover transition group-hover:scale-105"
                />

                {/* BADGE */}
                {item.highlight && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[rgb(var(--color-primary))] text-white text-[10px]">
                    {item.highlight}
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-3">

                <div className="text-xl">{item.icon}</div>

                <h3 className="h3">{item.title}</h3>

                <p className="caption text-[rgb(var(--color-muted))]">
                  {item.subtitle}
                </p>

                {/* CTA */}
                {item.product ? (
                  <>
                    <a
                      href={generateWA(item.product)}
                      target="_blank"
                      className="btn btn-primary w-full mt-2"
                    >
                      Tanya via WhatsApp
                    </a>

                    <Link
                      href={campaignUrl}
                      className="btn btn-outline w-full text-center"
                    >
                      Lihat Detail
                    </Link>
                  </>
                ) : (
                  <Link
                    href={campaignUrl}
                    className="btn btn-primary w-full mt-2 text-center"
                  >
                    Donasi Sekarang
                  </Link>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}