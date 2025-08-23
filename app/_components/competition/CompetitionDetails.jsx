"use client";

import { useEffect, useState } from "react";

export default function CompetitionDetails({ competition }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!competition?.drawDate) return;
    const getTL = () => {
      const target = new Date(competition.drawDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return { days, hours, minutes, seconds };
    };
    setTimeLeft(getTL());
    const t = setInterval(() => setTimeLeft(getTL()), 1000);
    return () => clearInterval(t);
  }, [competition?.drawDate]);

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  const cover = competition?.images?.[0]
    ? competition.images[0].startsWith("http")
      ? competition.images[0]
      : `${apiBase}${competition.images[0]}`
    : null;

  const sold = Number(competition?.soldTickets || 0);
  const max = Number(competition?.maxTickets || 0);
  const pct = max > 0 ? Math.min(100, Math.round((sold / max) * 100)) : 0;

  return (
    <section className="rounded-2xl border border-[#d4af37]/30 bg-[#111] shadow-xl overflow-hidden">
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img
          src={cover || "/images/watch1.webp"}
          alt={competition?.title || "Competition"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#ffd700] drop-shadow">
              {competition?.title}
            </h1>
            <p className="text-sm text-gray-300">{competition?.description}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Watch Value</p>
            <p className="text-xl font-bold text-[#ffd700]">
              £{Number(competition?.watchValue || 0).toLocaleString("en-GB")}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 grid md:grid-cols-3 gap-6">
        <div className="bg-[#0f0f0f] border border-[#d4af37]/40 rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Time remaining
          </p>
          {timeLeft ? (
            <div className="flex gap-4 text-center">
              {[
                ["Days", timeLeft.days],
                ["Hours", timeLeft.hours],
                ["Min", timeLeft.minutes],
                ["Sec", timeLeft.seconds],
              ].map(([label, v]) => (
                <div key={label} className="flex-1">
                  <p className="text-2xl font-extrabold text-white">
                    {String(v).padStart(2, "0")}
                  </p>
                  <p className="text-[11px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">—</p>
          )}
        </div>

        <div className="bg-[#0f0f0f] border border-[#d4af37]/40 rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Entry Price
          </p>
          <p className="text-2xl font-extrabold text-white">
            £{Number(competition?.entryPrice || 0).toLocaleString("en-GB")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Draw:{" "}
            {competition?.drawDate
              ? new Date(competition.drawDate).toLocaleDateString("en-GB")
              : "TBA"}
          </p>
        </div>

        <div className="bg-[#0f0f0f] border border-[#d4af37]/40 rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Tickets Sold
          </p>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-300">
              {sold.toLocaleString()} / {max.toLocaleString()}
            </span>
            <span className="text-[#ffd700] font-semibold">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#1b1b1b] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd700]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-6">
        <h3 className="text-lg font-bold text-white mb-3">Good to Know</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {[
            ["Brand", competition?.brand],
            ["Model", competition?.model],
            ["Reference number", competition?.referenceNumber],
            ["Movement", competition?.movement],
            ["Year", competition?.year],
            ["Caliber", competition?.caliber],
            ["Glass", competition?.glass],
            ["Bezel material", competition?.bezelMaterial],
            ["Bracelet material", competition?.braceletMaterial],
            ["Papers", competition?.papers],
            ["Maximum entries", competition?.maximumEntries],
            ["Maximum winners", competition?.maximumWinners],
          ].map(([k, v]) => (
            <div
              key={k}
              className="rounded-lg bg-[#0f0f0f] border border-[#d4af37]/20 px-3 py-2"
            >
              <p className="text-[11px] uppercase tracking-widest text-gray-400">
                {k}
              </p>
              <p className="text-white">{v ?? "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
