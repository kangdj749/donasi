"use client"

import Image from "next/image"
import Link from "next/link"
import { cloudinaryImage } from "@/lib/cloudinaryImage"

type ProgramItem = {
  title: string
  subtitle: string
  icon: string
  image: string
  href: string
}

const programs: ProgramItem[] = [
  {
    title: "Qurban Domba",
    subtitle: "Praktis untuk individu & keluarga",
    icon: "🐐",
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776554573/Jenis-hewan-kurban-domba_lz1cwn.jpg",
    href: "/campaign/peace-qurban",
  },
  {
    title: "Qurban Sapi",
    subtitle: "Dampak besar untuk lebih banyak penerima",
    icon: "🐄",
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776554325/Pusat20250511-015908-jual_20sapi2_jva4nr.webp",
    href: "/campaign/peace-qurban",
  },
  {
    title: "1/7 Sapi",
    subtitle: "Solusi qurban kolektif yang terjangkau",
    icon: "👥",
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776554084/img-20250530-174010-68398ba634777c1c1278d9d3_jkunpq.jpg",
    href: "/campaign/peace-qurban",
  },
  {
    title: "Sedekah Qurban",
    subtitle: "Tetap bisa berbagi meski belum mampu penuh",
    icon: "❤️",
    image:
      "https://res.cloudinary.com/de7fqcvpf/image/upload/v1776553887/Mengutamakan-berqurban-atau-sedekah_bhwqwt.jpg",
    href: "/campaign/peace-qurban",
  },
]

export default function ProgramSection() {
  return (
    <section
      className="
        relative
        section
        bg-[rgb(var(--color-bg))]
        overflow-hidden
      "
    >
      {/* ================= BACKGROUND ACCENT ================= */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] bg-[rgb(var(--color-primary))]/10 blur-3xl rounded-full" />
      </div>

      <div className="container-wide relative z-10">

        {/* ================= HEADER ================= */}
        <div className="max-w-[720px] mb-12">
          <p className="caption tracking-[0.25em] uppercase mb-4">
            PILIHAN PROGRAM
          </p>

          <h2
            className="
              text-[26px] md:text-[34px]
              font-semibold
              leading-[1.3]
              tracking-[-0.02em]
              text-[rgb(var(--color-text))]
              mb-6
            "
          >
            Pilih Qurban Terbaik Sesuai Kemampuan Anda
          </h2>

          <p className="body-lg text-[rgb(var(--color-muted))]">
            Setiap pilihan membawa kebaikan. Pilih yang paling sesuai,
            dan biarkan kami menyalurkannya kepada mereka yang membutuhkan.
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {programs.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="
                group
                relative
                block
                overflow-hidden
                rounded-[var(--radius-lg)]
                border border-[rgb(var(--color-border))]
                bg-[rgb(var(--color-surface))]
                shadow-[var(--shadow-soft)]
                transition
                hover:shadow-[var(--shadow-medium)]
                hover:-translate-y-1
              "
            >
              {/* IMAGE */}
              <div className="relative w-full h-[180px] overflow-hidden">
                <Image
                  src={cloudinaryImage(item.image, "card")}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="
                    object-cover
                    transition duration-500
                    group-hover:scale-105
                  "
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <div className="text-xl mb-2">{item.icon}</div>

                <h3 className="h3 text-[rgb(var(--color-text))] mb-2">
                  {item.title}
                </h3>

                <p className="caption">
                  {item.subtitle}
                </p>

              </div>

              {/* HOVER LINE */}
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[rgb(var(--color-primary))] transition-all duration-300 group-hover:w-full" />

            </Link>
          ))}
        </div>

        {/* ================= NOTE ================= */}
        <div className="mt-14 max-w-[720px]">
          <p className="body text-[rgb(var(--color-muted))]">
            Tidak harus menunggu mampu sepenuhnya untuk berbagi.
            Bahkan langkah kecil pun bisa menjadi awal dari kebaikan yang besar.
          </p>
        </div>

      </div>
    </section>
  )
}