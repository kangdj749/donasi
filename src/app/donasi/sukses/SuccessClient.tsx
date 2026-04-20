"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/* ================= TYPES ================= */

type PaymentStatus =
  | "checking"
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "error";

interface PaymentData {
  amount: number;
  va_number?: string | null;
  bank?: string | null;
  expiry_time?: string | null;
}

interface CampaignData {
  title: string;
  slug: string; // 🔥 tambah ini
  collected_amount: number;
  target_amount: number;
}

/* ================= HELPERS ================= */

function safeNumber(val: unknown): number {
  const n = Number(val);
  return Number.isNaN(n) ? 0 : n;
}

function formatCurrency(val: number): string {
  return `Rp ${val.toLocaleString("id-ID")}`;
}

/* ================= COMPONENT ================= */

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const donationId = searchParams.get("id");

  const [status, setStatus] = useState<PaymentStatus>("checking");
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);

  const [timeLeft, setTimeLeft] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState(6);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = useRef<PaymentStatus>("checking");

  /* ================= POLLING ================= */

  function stopPolling() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  async function fetchStatus() {
    if (!donationId) return;

    try {
      const res = await fetch(`/api/donations/status/${donationId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setStatus("error");
        stopPolling();
        return;
      }

      const data = await res.json();

      const nextStatus: PaymentStatus =
        data.payment_status === "paid"
          ? "paid"
          : data.payment_status === "failed"
          ? "failed"
          : data.payment_status === "expired"
          ? "expired"
          : "pending";

      statusRef.current = nextStatus;
      setStatus(nextStatus);

      setPayment({
        amount: safeNumber(data.amount),
        va_number: data.va_number ?? null,
        bank: data.bank ?? null,
        expiry_time: data.expiry_time ?? null,
      });

      setCampaign({
        title: data.campaign?.title ?? "",
        slug: data.campaign?.slug ?? "", // 🔥 penting
        collected_amount: safeNumber(
          data.campaign?.collected_amount
        ),
        target_amount: safeNumber(
          data.campaign?.target_amount
        ),
      });

      if (nextStatus !== "pending") {
        stopPolling();
      }
    } catch (err) {
      console.error("🔥 Payment status error:", err);
      setStatus("error");
      stopPolling();
    }
  }

  useEffect(() => {
    if (!donationId) {
      setStatus("error");
      return;
    }

    fetchStatus();

    intervalRef.current = setInterval(() => {
      if (statusRef.current === "pending") {
        fetchStatus();
      }
    }, 4000);

    return () => stopPolling();
  }, [donationId]);

  /* ================= COUNTDOWN ================= */

  useEffect(() => {
    if (!payment?.expiry_time) return;

    const interval = setInterval(() => {
      const diff =
        new Date(payment.expiry_time!).getTime() - Date.now();

      if (diff <= 0) {
        setStatus("expired");
        clearInterval(interval);
        return;
      }

      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [payment?.expiry_time]);

  /* ================= REDIRECT ================= */

  useEffect(() => {
  if (status !== "paid") return;

  const timer = setInterval(() => {
    setRedirectCountdown((prev) => {
      if (prev <= 1) {
        router.push(buildRedirectUrl());
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [status, router]);

  /* ================= CALC ================= */

  const percent =
    campaign && campaign.target_amount > 0
      ? Math.min(
          100,
          Math.round(
            (campaign.collected_amount /
              campaign.target_amount) *
              100
          )
        )
      : 0;

  /* ================= SHARE ================= */

  function getAffiliateCode(): string | null {
    const params = new URLSearchParams(window.location.search);
    const refFromUrl = params.get("ref");

    if (refFromUrl) return refFromUrl;

    const cookieMatch = document.cookie.match(/affiliate_ref=([^;]+)/);
    if (cookieMatch) return cookieMatch[1];

    return null;
  }

  function buildRedirectUrl(): string {
    const ref = getAffiliateCode();

    if (campaign?.slug) {
      let url = `/campaign/${campaign.slug}`;
      if (ref) url += `?ref=${ref}`;
      return url;
    }

    // fallback
    let url = "/";
    if (ref) url += `?ref=${ref}`;
    return url;
  }

  function handleShare() {
    if (!campaign?.slug) return;

    const ref = getAffiliateCode();

    let url = `${window.location.origin}/campaign/${campaign.slug}`;

    if (ref) {
      url += ref ? `?ref=${ref}&src=wa` : `?src=wa`;
    }

    const text = encodeURIComponent(
      `Saya baru saja berdonasi di program "${campaign.title}" 🙏

  Yuk ikut bantu:
  ${url}`
    );

    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-surface))] px-4">

      <div className="w-full max-w-md space-y-5 animate-fadeUp">

        {/* ================= CARD ================= */}
        <div className="card text-center space-y-4">

          {/* CHECKING */}
          {status === "checking" && (
            <>
              <div className="mx-auto h-10 w-10 border-4 border-[rgb(var(--color-border))] border-t-[rgb(var(--color-primary))] rounded-full animate-spin" />
              <h1 className="h3">Memverifikasi pembayaran...</h1>
            </>
          )}

          {/* PENDING */}
          {status === "pending" && payment && (
            <>
              <h1 className="h3">Selesaikan Pembayaran</h1>

              <div className="card text-left space-y-3">
                {payment.bank && (
                  <div>
                    <p className="caption-subtle">Bank</p>
                    <p className="body font-semibold uppercase">
                      {payment.bank}
                    </p>
                  </div>
                )}

                {payment.va_number && (
                  <div>
                    <p className="caption-subtle">VA</p>
                    <p className="body font-mono">
                      {payment.va_number}
                    </p>
                  </div>
                )}

                <div>
                  <p className="caption-subtle">Total</p>
                  <p className="h3">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>

                {timeLeft && (
                  <p className="caption text-red-500">
                    Batas waktu: {timeLeft}
                  </p>
                )}
              </div>

              <button
                onClick={fetchStatus}
                className="btn btn-primary w-full"
              >
                Saya Sudah Bayar
              </button>
            </>
          )}

          {/* SUCCESS */}
          {status === "paid" && campaign && (
            <>
              <div className="space-y-2">
                <h1 className="h2 text-[rgb(var(--color-primary))]">
                  🎉 Donasi Berhasil
                </h1>
                <p className="caption">
                  Terima kasih atas kontribusimu 🙏
                </p>
              </div>

              {/* AMOUNT */}
              <div className="text-center">
                <p className="caption text-[rgb(var(--color-muted))]">
                  Total Donasi
                </p>
                <p className="h2 text-[rgb(var(--color-primary))]">
                  {formatCurrency(payment?.amount || 0)}
                </p>
              </div>

              {/* IMPACT */}
              <div className="card text-left space-y-2">
                <p className="caption text-[rgb(var(--color-muted))]">
                  Dampak Donasi Kamu
                </p>
                <p className="body">💚 Membantu program berjalan</p>
                <p className="body">🤲 Menjadi amal jariyah</p>
              </div>

              {/* PROGRESS */}
              <div className="text-left">
                <p className="body font-medium mb-2">
                  {campaign.title}
                </p>

                <div className="progress-bar mb-2">
                  <div
                    className="progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between caption">
                  <span>{percent}%</span>
                  <span>
                    {formatCurrency(
                      campaign.collected_amount
                    )}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => router.push(buildRedirectUrl())}
                  className="btn btn-primary w-full"
                >
                  🔁 Lanjutkan Kebaikan
                </button>

                <button
                  onClick={handleShare}
                  className="btn btn-outline w-full"
                >
                  📲 Ajak Teman Donasi
                </button>
              </div>

              {/* AUTO REDIRECT */}
              <p className="caption text-[rgb(var(--color-muted))]">
                Kembali otomatis dalam {redirectCountdown} detik
              </p>
            </>
          )}

          {/* FAILED */}
          {status === "failed" && (
            <button
              onClick={() => router.back()}
              className="btn btn-primary w-full"
            >
              Coba Lagi
            </button>
          )}

          {/* EXPIRED */}
          {status === "expired" && (
            <button
              onClick={() => router.push("/")}
              className="btn btn-primary w-full"
            >
              Donasi Ulang
            </button>
          )}

          {/* ERROR */}
          {status === "error" && (
            <p className="caption">
              Terjadi kesalahan saat verifikasi
            </p>
          )}
        </div>
      </div>
    </div>
  );
}