"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import CompetitionDetails from "@/app/_components/competition/CompetitionDetails";
import TicketSelection from "@/app/_components/competition/TicketSelection";
import BidSummary from "@/app/_components/competition/BidSummary";
import PaymentMethods from "@/app/_components/competition/PaymentMethods";

export default function CompetitionPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // step: 1 Details (always visible at top), 2 Ticket selection, 3 Bid summary, 4 Payment
  const [step, setStep] = useState(2);

  // selection state from TicketSelection
  const [selection, setSelection] = useState({
    mode: "manual", // 'manual' | 'vip'
    manualQty: 1,
    vipIndex: null, // index in competition.vipPacks
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/competitions/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (mounted) setCompetition(data);
      } catch (e) {
        console.error(e);
        if (mounted) setErr("Failed to load competition.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // handle success/cancel coming back from payment providers (optional display)
  const paymentStatus = searchParams.get("payment_status");
  const provider = searchParams.get("provider");
  const message =
    paymentStatus === "success"
      ? `Payment successful via ${provider || "provider"}`
      : paymentStatus === "cancel"
      ? `Payment canceled`
      : null;

  const unitPrice = competition?.entryPrice || 0;

  const vipPack = useMemo(() => {
    if (!competition || selection.vipIndex == null) return null;
    return competition.vipPacks?.[selection.vipIndex] || null;
  }, [competition, selection.vipIndex]);

  const discountPercent = useMemo(() => {
    if (!vipPack?.discount) return 0;
    // expects formats like "10% off", "15%", "10 % OFF"
    const m = String(vipPack.discount).match(/(\d+(?:\.\d+)?)\s*%/i);
    return m ? Number(m[1]) : 0;
  }, [vipPack]);

  const quantity =
    selection.mode === "vip" && vipPack?.tickets
      ? Number(vipPack.tickets)
      : Number(selection.manualQty || 0);

  const subtotal = unitPrice * quantity;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const nextDisabled =
    (step === 2 && (!quantity || quantity <= 0)) ||
    (step === 3 && (!quantity || quantity <= 0));

  const goNext = () => setStep((s) => Math.min(4, s + 1));
  const goPrev = () => setStep((s) => Math.max(2, s - 1));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading competition…</div>
      </div>
    );
  }
  if (err || !competition) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        {err || "Not found"}
      </div>
    );
  }

  return (
    <div className="bg-[#0b0b0b] text-white">
      {/* Top container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Payment return banner (optional) */}
        {message && (
          <div
            className={`rounded-xl px-4 py-3 ${
              paymentStatus === "success"
                ? "bg-green-600/20 border border-green-600/40"
                : "bg-yellow-600/20 border border-yellow-600/40"
            }`}
          >
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* 1) Competition details (always visible) */}
        <CompetitionDetails competition={competition} />

        {/* Stepper */}
        <div className="mt-6">
          <ol className="flex items-center w-full text-sm md:text-base">
            <li
              className={`flex-1 flex items-center gap-2 after:flex-1 after:h-0.5 after:mx-3 ${
                step >= 2 ? "text-[#ffd700]" : "text-gray-500"
              } after:bg-gray-700`}
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#d4af37]">
                1
              </span>
              Select Ticket
            </li>
            <li
              className={`flex-1 flex items-center gap-2 after:flex-1 after:h-0.5 after:mx-3 ${
                step >= 3 ? "text-[#ffd700]" : "text-gray-500"
              } after:bg-gray-700`}
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#d4af37]">
                2
              </span>
              Bid Summary
            </li>
            <li
              className={`flex-1 flex items-center gap-2 ${
                step >= 4 ? "text-[#ffd700]" : "text-gray-500"
              }`}
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#d4af37]">
                3
              </span>
              Payment
            </li>
          </ol>
        </div>

        {/* 2) Ticket selection */}
        {step === 2 && (
          <TicketSelection
            competition={competition}
            selection={selection}
            onChange={setSelection}
          />
        )}

        {/* 3) Bid summary */}
        {step === 3 && (
          <BidSummary
            competition={competition}
            selection={selection}
            vipPack={vipPack}
            unitPrice={unitPrice}
            discountPercent={discountPercent}
            discountAmount={discountAmount}
            subtotal={subtotal}
            total={total}
          />
        )}

        {/* 4) Payment methods */}
        {step === 4 && (
          <PaymentMethods
            competition={competition}
            selection={selection}
            totals={{
              unitPrice,
              quantity,
              subtotal,
              discountPercent,
              discountAmount,
              total,
            }}
          />
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={goPrev}
            disabled={step === 2}
            className="px-4 py-2 rounded-lg border border-[#d4af37]/60 text-[#ffd700] disabled:opacity-40 hover:bg-[#d4af37]/10 transition"
          >
            Back
          </button>

          {step < 4 && (
            <button
              onClick={goNext}
              disabled={nextDisabled}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black font-semibold disabled:opacity-40 hover:scale-[1.02] transition"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
