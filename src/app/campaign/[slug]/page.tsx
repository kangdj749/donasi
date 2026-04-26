import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { getCampaignBySlug } from "@/lib/campaign.service";
import {
  getRecentDonors,
  getRecentPrayers,
  getCampaignTrustStats,
} from "@/lib/campaign.extras.service";

import { getCampaignUpdates } from "@/lib/campaign.updates.service";
import { getCampaignProducts } from "@/lib/campaign.product.service";

import CampaignHero from "@/components/campaign/CampaignHero";
import CampaignProgress from "@/components/campaign/CampaignProgress";
import CampaignStoryRenderer from "@/components/campaign/CampaignStoryRenderer";
import CampaignStorySkeleton from "@/components/campaign/CampaignStorySkeleton";

import CampaignTrustBlock from "@/components/campaign/CampaignTrustBlock";
import CampaignTabs from "@/components/campaign/CampaignTabs";
import AffiliateShareBox from "@/components/campaign/AffiliateShareBox";
import CampaignUpdatesTimeline from "@/components/campaign/CampaignUpdatesTimeline";

import DonationSection from "./DonationSection";
import CampaignClientWrapper from "./CampaignClientWrapper";

/* ================= CONFIG ================= */

export const revalidate = 60;

/* ================= HELPERS ================= */

function formatCurrency(value?: number | null): string {
  return (value ?? 0).toLocaleString("id-ID");
}

async function safeFetch<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("SAFE FETCH ERROR:", err);
    return fallback;
  }
}

/* ================= LOGIC ================= */

function shouldShowProgress(type: string): boolean {
  return ["donation", "event", "qurban"].includes(type);
}

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await safeFetch(
    () => getCampaignBySlug(params.slug),
    null
  );

  if (!campaign) {
    return {
      title: "Campaign tidak ditemukan",
    };
  }

  return {
    title: campaign.title,
    description:
      campaign.short_tagline ||
      "Salurkan donasi terbaik Anda sekarang.",
    openGraph: {
      title: campaign.title,
      description:
        campaign.short_tagline ||
        "Salurkan donasi terbaik Anda sekarang.",
      images: [
        {
          url: campaign.hero_image_public_id || "",
        },
      ],
    },
  };
}

/* ================= PAGE ================= */

export default async function CampaignPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { ref?: string; src?: string };
}) {
  const campaign = await safeFetch(
    () => getCampaignBySlug(params.slug),
    null
  );

  if (!campaign) return notFound();

  const type = campaign.type;

  const [
    donors,
    prayers,
    trustStats,
    updates,
    products,
  ] = await Promise.all([
    safeFetch(() => getRecentDonors(campaign.id), []),
    safeFetch(() => getRecentPrayers(campaign.id), []),
    safeFetch(() => getCampaignTrustStats(campaign.id), {
      totalDonors: 0,
      totalAmount: 0,
    }),
    safeFetch(() => getCampaignUpdates(campaign.id), []),
    safeFetch(() => getCampaignProducts(campaign.id), []),
  ]);

  /* ================= AFFILIATE ================= */

  let affiliateCode: string | null = null;
  let affiliateSource: string | null = null;

  try {
    const cookieStore = cookies();

    const cookieRef =
      cookieStore.get("affiliate_ref")?.value ?? null;

    affiliateCode =
      searchParams?.ref?.trim() ||
      cookieRef ||
      null;

    affiliateSource =
      searchParams?.src?.trim() ||
      "direct";
  } catch {
    affiliateCode = searchParams?.ref ?? null;
    affiliateSource = searchParams?.src ?? "direct";
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[rgb(var(--color-surface))] flex justify-center">
      <div className="w-full container-narrow bg-[rgb(var(--color-bg))] pb-32">

        {/* HERO */}
        <CampaignHero
          title={campaign.title}
          image={campaign.hero_image_public_id}
          videoUrl={campaign.hero_video_url}
        />

        {/* HEADER */}
        <div className="section space-y-6">

          <div className="space-y-2">
            <h1 className="h1 text-[rgb(var(--color-text))]">
              {campaign.title}
            </h1>
            <p className="caption text-[rgb(var(--color-muted))]">
              {campaign.short_tagline}
            </p>
          </div>

          <CampaignTrustBlock
            name={campaign.organization?.name || "Penggalang Dana"}
            logo={campaign.organization?.logo}
            verified={campaign.organization?.verified}
            totalDonors={trustStats.totalDonors}
          />

          {shouldShowProgress(type) && (
            <div className="card space-y-4">
              <span className="caption text-[rgb(var(--color-muted))]">
                💚 {trustStats.totalDonors} donatur
              </span>

              <CampaignProgress
                slug={campaign.slug}
                initialCollected={campaign.collected_amount}
                goal_amount={campaign.goal_amount}
              />
            </div>
          )}
        </div>

        {/* PRODUCT */}
        {type === "qurban" && products.length > 0 && (
          <CampaignClientWrapper
            products={products}
            campaignId={campaign.id}
            organizationId={campaign.organization_id}
            campaignSlug={campaign.slug}
            organizationSlug={campaign.organization?.slug || ""}
            category={campaign.category}
            affiliateCode={affiliateCode}
          />
        )}

        {/* TABS */}
        <CampaignTabs
          slug={campaign.slug}
          prayersCount={prayers.length}
          donors={
            <div className="space-y-3">
              {donors.map((d) => (
                <div key={d.id} className="card flex justify-between">
                  <span className="body text-[rgb(var(--color-text))]">
                    {d.name || "Hamba Allah"}
                  </span>
                  <span className="body font-semibold text-[rgb(var(--color-primary))]">
                    Rp {formatCurrency(d.amount)}
                  </span>
                </div>
              ))}
            </div>
          }
          updates={
            updates.length > 0 ? (
              <CampaignUpdatesTimeline updates={updates} />
            ) : null
          }
        />

        {/* STORY */}
        <div className="section-tight">
          <div className="card space-y-4">
            <h2 className="h3 text-[rgb(var(--color-text))]">
              Cerita Penggalangan
            </h2>

            {campaign.stories?.length ? (
              <CampaignStoryRenderer sections={campaign.stories} />
            ) : (
              <CampaignStorySkeleton />
            )}
          </div>
        </div>

        {/* SHARE */}
        <div className="section">
          <AffiliateShareBox
            campaignSlug={campaign.slug}
            campaignTitle={campaign.title}
            referralCode={affiliateCode}
          />
        </div>

        {/* DONATION */}
        <DonationSection
          campaignId={campaign.id}
          organizationId={campaign.organization_id}
          campaignSlug={campaign.slug}
          organizationSlug={campaign.organization?.slug || ""}
          category={campaign.category || ""}
          affiliateCode={affiliateCode}
        />
      </div>
    </div>
  );
}