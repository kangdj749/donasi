import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CATEGORY_MAP } from "@/lib/category"
import { cloudinaryImage } from "@/lib/cloudinary"

export const dynamic = "force-dynamic"

/* ================= TYPES ================= */

type Campaign = {
  id: string
  slug: string
  title: string
  shortTagline: string
  category: string
  image: string
  collected: number
  goal: number
}

/* ================= HELPERS ================= */

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID").format(n || 0)
}

function percent(collected: number, goal: number) {
  if (!goal) return 0
  return Math.min(100, Math.round((collected / goal) * 100))
}

/* 🔥 FIX: parse category string */
function parseCategory(cat: string): string[] {
  if (!cat) return []

  return cat
    .replace(/"/g, "") // remove quote
    .split(",")
    .map((c) => c.trim().toLowerCase())
}

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const category = Object.values(CATEGORY_MAP).find(
    (c) => c.slug === params.slug
  )

  if (!category) return {}

  return {
    title: `${category.name} | Donasi Graha Dhuafa`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Donasi`,
      description: category.description,
      url: `https://donasi.grahadhuafa.org/category/${category.slug}`,
      type: "website",
    },
  }
}

/* ================= PAGE ================= */

export default async function CategoryDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const category = Object.values(CATEGORY_MAP).find(
    (c) => c.slug === params.slug
  )

  if (!category) return notFound()

  /* ================= FETCH ================= */

  async function getCampaigns(): Promise<Campaign[]> {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    try {
      const res = await fetch(`${baseUrl}/api/campaign/list`, {
        cache: "no-store",
      })

      if (!res.ok) return []

      const json = await res.json()
      return json.data || []
    } catch (err) {
      console.error("FETCH CAMPAIGN ERROR:", err)
      return []
    }
  }

  const allCampaigns = await getCampaigns()

  /* ================= FILTER ================= */

  const campaigns = allCampaigns.filter((c) =>
    parseCategory(c.category).includes(params.slug)
  )

  /* ================= UI ================= */

  return (
    <div className="container-main py-8 space-y-6 animate-fadeIn">

      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="h2">{category.name}</h1>
        <p className="caption">{category.description}</p>
      </div>

      {/* EMPTY */}
      {campaigns.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-muted">
            Belum ada campaign di kategori ini
          </p>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-5">

        {campaigns.map((c) => (
          <Link
            key={c.id}
            href={`/campaign/${c.slug}`}
            className="block group"
          >
            <div className="card overflow-hidden p-0 hover:shadow-[var(--shadow-elevated)] transition-all">

              {/* IMAGE */}
              <div className="relative aspect-[16/9] bg-[rgb(var(--color-soft))] overflow-hidden">
                <img
                  src={cloudinaryImage(c.image, 800)}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-3">

                <h3 className="font-semibold leading-snug line-clamp-2">
                  {c.title}
                </h3>

                <p className="caption line-clamp-2">
                  {c.shortTagline}
                </p>

                {/* PROGRESS */}
                <div className="space-y-2">

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percent(c.collected, c.goal)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted">
                    <span>Rp {formatRp(c.collected)}</span>
                    <span>{percent(c.collected, c.goal)}%</span>
                  </div>

                </div>

              </div>
            </div>
          </Link>
        ))}

      </div>

    </div>
  )
}