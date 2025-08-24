"use client";

import api from "@/lib/axios";
import { useMemo, useState } from "react";

export default function PaymentMethods({ competition, selection, totals }) {
  const [method, setMethod] = useState(null); // 'stripe' | 'paypal' | 'crypto'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const qty =
    selection.mode === "vip"
      ? Number(competition?.vipPacks?.[selection.vipIndex || 0]?.tickets || 0)
      : Number(selection.manualQty || 0);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const canPay = useMemo(() => {
    return method && qty > 0 && totals?.total > 0;
  }, [method, qty, totals]);

  const startPayment = async () => {
    if (!canPay) return;
    try {
      setErr(null);
      setLoading(true);

      const payload = {
        competitionId: String(competition?._id || competition?.id),
        selection: {
          mode: selection.mode,
          manualQty: selection.mode === "manual" ? qty : 0,
          vipIndex: selection.mode === "vip" ? selection.vipIndex : null, // <-- send index
          vipPack:
            selection.mode === "vip"
              ? competition.vipPacks?.[selection.vipIndex || 0]
              : null,
        },
        pricing: {
          unitPrice: totals.unitPrice,
          quantity: totals.quantity || qty,
          subtotal: totals.subtotal,
          discountPercent: totals.discountPercent,
          discountAmount: totals.discountAmount,
          total: totals.total,
          currency: "GBP",
        },
        returnUrl:
          typeof window !== "undefined"
            ? `${window.location.origin}/competitions/${competition?._id}?payment_status=success&provider=${method}`
            : "",
        cancelUrl:
          typeof window !== "undefined"
            ? `${window.location.origin}/competitions/${competition?._id}?payment_status=cancel&provider=${method}`
            : "",
      };

      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const { data } = await api.post(`/payments/${method}/create`, payload, {
        headers,
      });

      // backend returns { redirectUrl }
      const redirectUrl = data?.redirectUrl || data?.url;
      if (!redirectUrl) throw new Error("No redirect URL from provider");

      window.location.href = redirectUrl;
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || e?.message || "Payment init failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#d4af37]/30 bg-[#111] shadow-xl p-5">
      <h2 className="text-xl font-bold mb-4">3) Payment</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <button
            type="button"
            onClick={() => setMethod("stripe")}
            className={`w-full text-left rounded-xl p-4 border transition ${
              method === "stripe"
                ? "border-[#ffd700] bg-[#1a1a1a]"
                : "border-[#d4af37]/30 bg-[#0f0f0f] hover:bg-[#131313]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Pay by Card (Stripe)</p>
                <p className="text-xs text-gray-400">
                  Visa, Mastercard, Amex, Apple Pay (if enabled)
                </p>
              </div>
              <span className="text-xs text-[#ffd700]">Recommended</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod("paypal")}
            className={`w-full text-left rounded-xl p-4 border transition ${
              method === "paypal"
                ? "border-[#ffd700] bg-[#1a1a1a]"
                : "border-[#d4af37]/30 bg-[#0f0f0f] hover:bg-[#131313]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">PayPal</p>
                <p className="text-xs text-gray-400">
                  Pay with PayPal balance or linked cards
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMethod("crypto")}
            className={`w-full text-left rounded-xl p-4 border transition ${
              method === "crypto"
                ? "border-[#ffd700] bg-[#1a1a1a]"
                : "border-[#d4af37]/30 bg-[#0f0f0f] hover:bg-[#131313]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Crypto</p>
                <p className="text-xs text-gray-400">
                  BTC / ETH / USDT (provider required)
                </p>
              </div>
            </div>
          </button>

          {err && (
            <div className="text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded-lg p-3">
              {err}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-[#0f0f0f] border border-[#d4af37]/30 p-4 h-fit">
          <h4 className="font-semibold text-white mb-3">Total to pay</h4>
          <p className="text-2xl font-extrabold text-[#ffd700]">
            £{totals.total.toLocaleString("en-GB")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Includes discount {totals.discountPercent}% (−£
            {totals.discountAmount.toLocaleString("en-GB")})
          </p>

          <button
            disabled={!canPay || loading}
            onClick={startPayment}
            className="mt-4 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black font-semibold disabled:opacity-40 hover:scale-[1.02] transition"
          >
            {loading
              ? "Preparing checkout…"
              : method === "paypal"
              ? "Pay with PayPal"
              : method === "crypto"
              ? "Pay with Crypto"
              : "Pay by Card (Stripe)"}
          </button>

          {!method && (
            <p className="text-[11px] text-gray-500 mt-2">
              Choose a payment method to continue.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
