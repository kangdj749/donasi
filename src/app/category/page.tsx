import { Metadata } from "next"
import Link from "next/link"
import { CATEGORY_MAP } from "@/lib/category"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Kategori Donasi | Graha Dhuafa",
  description:
    "Pilih kategori donasi: kemanusiaan, kesehatan, pendidikan, lingkungan, zakat, dan lainnya.",
}

export default function CategoryPage() {
  const categories = Object.values(CATEGORY_MAP)

  return (
    <div className="container-main py-8 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="h2">Kategori Donasi</h1>
        <p className="caption">
          Pilih campaign yang ingin kamu dukung
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon

          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="card hover:scale-[1.03] transition-all"
            >
              <div className="space-y-3">

                {/* ICON */}
                <div className="w-12 h-12 rounded-xl bg-[rgb(var(--color-primary)/0.1)] flex items-center justify-center">
                  <Icon
                    size={22}
                    className="text-[rgb(var(--color-primary))]"
                  />
                </div>

                {/* TEXT */}
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="caption line-clamp-2">
                    {cat.description}
                  </p>
                </div>

              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}