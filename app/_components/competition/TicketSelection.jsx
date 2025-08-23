"use client";

import { useMemo } from "react";

export default function TicketSelection({ competition, selection, onChange }) {
  const entryPrice = Number(competition?.entryPrice || 0);

  const selectVip = (idx) => {
    onChange({ mode: "vip", manualQty: 0, vipIndex: idx });
  };

  const setManualQty = (qty) => {
    const n = Math.max(1, Math.min(9999, Number(qty) || 0));
    onChange({ mode: "manual", manualQty: n, vipIndex: null });
  };

  const addManual = (delta) => {
    const next = Math.max(1, Number(selection.manualQty || 1) + delta);
    onChange({ mode: "manual", manualQty: next, vipIndex: null });
  };

  const chosenVip =
    selection.mode === "vip" && selection.vipIndex != null
      ? competition?.vipPacks?.[selection.vipIndex]
      : null;

  const discountPercent = useMemo(() => {
    if (!chosenVip?.discount) return 0;
    const m = String(chosenVip.discount).match(/(\d+(?:\.\d+)?)\s*%/i);
    return m ? Number(m[1]) : 0;
  }, [chosenVip]);

  const qty =
    selection.mode === "vip"
      ? Number(chosenVip?.tickets || 0)
      : Number(selection.manualQty || 0);

  const subtotal = entryPrice * qty;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <section className="rounded-2xl border border-[#d4af37]/30 bg-[#111] shadow-xl p-5">
      <h2 className="text-xl font-bold mb-4">1) Select your ticket</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-xl bg-[#0f0f0f] border border-[#d4af37]/30 p-4">
          <p className="text-sm text-gray-300 mb-2">
            Manual selection (ticket count)
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => addManual(-1)}
              className="px-3 py-2 rounded-lg border border-[#d4af37]/60 text-[#ffd700] hover:bg-[#d4af37]/10"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={selection.mode === "manual" ? selection.manualQty : 0}
              onChange={(e) => setManualQty(e.target.value)}
              className="w-24 bg-transparent text-center border border-gray-700 rounded-lg py-2 outline-none"
            />
            <button
              onClick={() => addManual(1)}
              className="px-3 py-2 rounded-lg border border-[#d4af37]/60 text-[#ffd700] hover:bg-[#d4af37]/10"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Selecting manual count will{" "}
            <span className="text-[#ffd700]">deselect VIP</span>.
          </p>
        </div>

        <div className="lg:col-span-2">
          <p className="text-sm text-gray-300 mb-2">VIP Pack</p>
          {Array.isArray(competition?.vipPacks) &&
          competition.vipPacks.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {competition.vipPacks.map((pack, idx) => {
                const active =
                  selection.mode === "vip" && selection.vipIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectVip(idx)}
                    className={`text-left rounded-xl p-4 border transition ${
                      active
                        ? "border-[#ffd700] bg-[#1a1a1a]"
                        : "border-[#d4af37]/30 bg-[#0f0f0f] hover:bg-[#131313]"
                    }`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-white">
                        {pack.tickets}
                      </span>
                      <span className="text-sm text-gray-400">tickets</span>
                    </div>
                    <p className="mt-2 text-sm text-[#ffd700] font-semibold">
                      {pack.discount || "Best value"}
                    </p>
                    {pack.chance && (
                      <p className="text-xs text-gray-400 mt-1">
                        {pack.chance}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-[#d4af37]/20 bg-[#0f0f0f] p-4 text-sm text-gray-400">
              No VIP packs configured.
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Selecting a VIP pack will{" "}
            <span className="text-[#ffd700]">clear manual quantity</span>.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-[#0f0f0f] border border-[#d4af37]/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div>
            <p className="text-gray-400">Unit price</p>
            <p className="text-white font-semibold">
              £{entryPrice.toLocaleString("en-GB")}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Quantity</p>
            <p className="text-white font-semibold">{qty}</p>
          </div>
          <div>
            <p className="text-gray-400">Subtotal</p>
            <p className="text-white font-semibold">
              £{subtotal.toLocaleString("en-GB")}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Discount</p>
            <p className="text-white font-semibold">
              {discountPercent}% (−£{discountAmount.toLocaleString("en-GB")})
            </p>
          </div>
          <div>
            <p className="text-gray-400">Total</p>
            <p className="text-[#ffd700] font-extrabold text-lg">
              £{total.toLocaleString("en-GB")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
