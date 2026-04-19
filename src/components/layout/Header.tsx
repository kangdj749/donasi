"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const pathname = usePathname()

  const isHome = pathname === "/"
  const isCampaign = pathname?.startsWith("/campaign")

  /* ================= SCROLL STATE ================= */
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll() // initial check

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-300

        ${
          scrolled
            ? "bg-[rgb(var(--color-dark))]/90 backdrop-blur-md border-b border-[rgb(var(--color-border))] shadow-[var(--shadow-medium)]"
            : "bg-transparent border-transparent"
        }
      `}
    >
      <div className="container-wide flex h-[72px] items-center justify-between">

        {/* ================= LOGO ================= */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="
              h-9 w-9 rounded-lg
              bg-[rgb(var(--color-primary))]
              flex items-center justify-center
              text-[rgb(var(--color-white))]
              font-bold
            "
          >
            G
          </div>

          <span
            className={`
              text-sm font-semibold transition

              ${
                scrolled
                  ? "text-[rgb(var(--color-white))]"
                  : "text-[rgb(var(--color-white))]"
              }
            `}
          >
            GDI Donasi
          </span>
        </Link>

        {/* ================= NAV ================= */}
        <nav className="hidden md:flex items-center gap-8 text-sm">

          <Link
            href="/"
            className={`
              transition

              ${
                isHome
                  ? "text-[rgb(var(--color-accent))] font-semibold"
                  : "text-white/80 hover:text-white"
              }
            `}
          >
            Beranda
          </Link>

          <Link
            href="/campaign"
            className={`
              transition

              ${
                isCampaign
                  ? "text-[rgb(var(--color-accent))] font-semibold"
                  : "text-white/80 hover:text-white"
              }
            `}
          >
            Campaign
          </Link>

          <Link
            href="/tentang"
            className="text-white/80 hover:text-white transition"
          >
            Tentang
          </Link>
        </nav>

        {/* ================= CTA ================= */}
        <div className="hidden md:block">
          <Link
            href="/campaign"
            className="
              btn
              bg-[rgb(var(--color-accent))]
              text-[rgb(var(--color-white))]
              px-4 py-2 text-sm font-semibold

              shadow-[var(--shadow-soft)]
              hover:bg-[rgb(var(--color-accent-dark))]
              hover:translate-y-[-1px]
              transition
            "
          >
            Donasi Sekarang
          </Link>
        </div>
      </div>
    </header>
  )
}