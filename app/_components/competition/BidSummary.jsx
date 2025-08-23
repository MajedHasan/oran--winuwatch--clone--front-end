"use client";

export default function BidSummary({
  competition,
  selection,
  vipPack,
  unitPrice,
  discountPercent,
  discountAmount,
  subtotal,
  total,
}) {
  const qty =
    selection.mode === "vip"
      ? Number(vipPack?.tickets || 0)
      : Number(selection.manualQty || 0);

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  const imageUrl = competition?.images?.[0]
    ? competition.images[0].startsWith("http")
      ? competition.images[0]
      : `${apiBase}${competition.images[0]}`
    : "/images/watch1.webp";

  return (
    <section className="rounded-2xl border border-[#d4af37]/30 bg-[#111] shadow-xl p-5">
      <h2 className="text-xl font-bold mb-4">2) Bid Summary</h2>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 rounded-xl bg-[#0f0f0f] border border-[#d4af37]/30 p-4">
          <div className="flex items-start gap-4">
            <div className="w-28 h-20 overflow-hidden rounded-lg">
              <img
                src={imageUrl}
                alt={competition?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Competition</p>
              <h3 className="text-white font-semibold">{competition?.title}</h3>
              <p className="text-xs text-gray-500">
                Draw date:{" "}
                {competition?.drawDate
                  ? new Date(competition.drawDate).toLocaleString("en-GB")
                  : "TBA"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-[#d4af37]/20 p-3">
              <p className="text-gray-400">Ticket type</p>
              <p className="text-white">
                {selection.mode === "vip" ? "VIP Pack" : "Manual Count"}
              </p>
            </div>
            <div className="rounded-lg border border-[#d4af37]/20 p-3">
              <p className="text-gray-400">Quantity</p>
              <p className="text-white">{qty}</p>
            </div>
            {selection.mode === "vip" && vipPack && (
              <>
                <div className="rounded-lg border border-[#d4af37]/20 p-3">
                  <p className="text-gray-400">VIP Pack</p>
                  <p className="text-white">
                    {vipPack?.tickets} tickets • {vipPack?.discount}
                  </p>
                </div>
                {vipPack?.chance && (
                  <div className="rounded-lg border border-[#d4af37]/20 p-3">
                    <p className="text-gray-400">Chance</p>
                    <p className="text-white">{vipPack?.chance}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-[#0f0f0f] border border-[#d4af37]/30 p-4">
          <h4 className="font-semibold text-white mb-3">Totals</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Unit price</span>
              <span>£{unitPrice.toLocaleString("en-GB")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Quantity</span>
              <span>{qty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>£{subtotal.toLocaleString("en-GB")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                Discount ({discountPercent}%)
              </span>
              <span>−£{discountAmount.toLocaleString("en-GB")}</span>
            </div>
            <div className="border-t border-[#d4af37]/20 pt-2 flex items-center justify-between font-bold text-[#ffd700]">
              <span>Total</span>
              <span>£{total.toLocaleString("en-GB")}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 mt-3">
            By proceeding, you confirm you are 18+ and agree to Terms &
            Conditions. All tickets are non-refundable once purchased.
          </p>
        </div>
      </div>
    </section>
  );
}
