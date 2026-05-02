"use client"

import Link from "next/link"
import { Heart, Users } from "lucide-react"
import { cloudinaryImage } from "@/lib/cloudinary"

type Campaign = {
  id: string
  slug: string
  title: string
  shortTagline: string
  category: string[]
  imageId: string
  goal: number
  collected: number
  donors: number
}

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID").format(n || 0)
}

function calcProgress(collected: number, goal: number) {
  if (!goal) return 0
  return Math.min(100, Math.round((collected / goal) * 100))
}

export default function CampaignCard({ data }: { data: Campaign }) {
  const progress = calcProgress(data.collected, data.goal)

  return (
    <Link
      href={`/campaign/${data.slug}`}
      className="group block"
    >
      <div className="card p-0 overflow-hidden">

        {/* IMAGE */}
        <div className="relative">
          <img
            src={cloudinaryImage(data.imageId, 600)}
            alt={data.title}
            className="w-full h-[180px] object-cover group-hover:scale-[1.03] transition duration-500"
          />

          {/* overlay subtle */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-3">

          {/* TITLE */}
          <div className="space-y-1">
            <h3 className="font-medium leading-snug line-clamp-2">
              {data.title}
            </h3>

            <p className="caption line-clamp-2">
              {data.shortTagline}
            </p>
          </div>

          {/* PROGRESS */}
          <div className="space-y-1">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-muted">
              <span>{progress}%</span>
              <span>{data.donors} donatur</span>
            </div>
          </div>

          {/* STATS */}
          <div className="flex justify-between items-end">

            <div>
              <p className="caption-subtle">Terkumpul</p>
              <p className="font-semibold text-primary">
                Rp {formatRp(data.collected)}
              </p>
            </div>

            <div className="flex items-center gap-1 text-muted text-xs">
              <Users size={14} />
              {data.donors}
            </div>

          </div>

        </div>
      </div>
    </Link>
  )
}