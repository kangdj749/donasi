import type { LucideIcon } from "lucide-react"
import {
  HeartHandshake,
  Leaf,
  GraduationCap,
  HeartPulse,
  HandCoins,
  Users,
  Building2,
  Globe,
  Sprout,
} from "lucide-react"

export type CategorySEO = {
  slug: string
  name: string
  description: string
  icon: LucideIcon
}

export const CATEGORY_MAP: Record<string, CategorySEO> = {
  kemanusiaan: {
    slug: "kemanusiaan",
    name: "Kemanusiaan",
    description: "Bantu sesama dalam kondisi darurat & krisis kemanusiaan.",
    icon: HeartHandshake,
  },

  kesehatan: {
    slug: "kesehatan",
    name: "Kesehatan",
    description: "Dukung pengobatan & layanan kesehatan untuk yang membutuhkan.",
    icon: HeartPulse,
  },

  pendidikan: {
    slug: "pendidikan",
    name: "Pendidikan",
    description: "Bantu akses pendidikan untuk generasi masa depan.",
    icon: GraduationCap,
  },

  lingkungan: {
    slug: "lingkungan",
    name: "Lingkungan",
    description: "Aksi nyata untuk menjaga bumi & alam sekitar.",
    icon: Leaf,
  },

  zakat: {
    slug: "zakat",
    name: "Zakat & Sedekah",
    description: "Salurkan zakat, infak, dan sedekah dengan amanah.",
    icon: HandCoins, // 🔥 ganti dari Mosque
  },

  sosial: {
    slug: "sosial",
    name: "Sosial",
    description: "Program sosial untuk kesejahteraan masyarakat.",
    icon: Users,
  },

  rumah_ibadah: {
    slug: "rumah-ibadah",
    name: "Rumah Ibadah",
    description: "Pembangunan & renovasi tempat ibadah.",
    icon: Building2, // 🔥 alternatif mosque
  },

  global: {
    slug: "global",
    name: "Bantuan Global",
    description: "Dukungan kemanusiaan lintas negara.",
    icon: Globe,
  },

  ekonomi: {
    slug: "ekonomi",
    name: "Pemberdayaan Ekonomi",
    description: "Bantu UMKM & ekonomi masyarakat kecil.",
    icon: Sprout,
  },
}