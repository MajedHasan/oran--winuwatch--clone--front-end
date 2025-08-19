"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Ticket,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Bell,
  Crown,
  Wallet,
} from "lucide-react";
import Image from "next/image";

// ---------- Helpers ----------
const classNames = (...c) => c.filter(Boolean).join(" ");

function useCountdown(targetISO) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const isEnded = diff <= 0;
  return { days, hours, mins, secs, isEnded, total: diff };
}

function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd56b] rounded-full transition-all"
        style={{ width: `${pct}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        role="progressbar"
      />
    </div>
  );
}

// ---------- Mock data (realistic) ----------
const MOCK_ACTIVE = [
  {
    id: "bw-01",
    title: "Rolex GMT-Master II “Bruce Wayne”",
    ref: "126710BLNR",
    image: "/images/rolex-bruce-wayne.webp",
    entryPrice: 15,
    ticketsBought: 8,
    ticketsSold: 1240,
    ticketsMax: 2000,
    watchValue: 20000,
    drawDate: "2025-08-22T18:30:00Z",
  },
  {
    id: "rg-18",
    title: "Rolex Day-Date 40 Everose Gold",
    ref: "228235",
    image: "/images/rolex-everose-18k.webp",
    entryPrice: 25,
    ticketsBought: 3,
    ticketsSold: 910,
    ticketsMax: 1600,
    watchValue: 52000,
    drawDate: "2025-09-05T20:00:00Z",
  },
  {
    id: "aq-5167a",
    title: "Patek Philippe Aquanaut 5167A",
    ref: "5167A-001",
    image: "/images/patek-5167a.webp",
    entryPrice: 30,
    ticketsBought: 12,
    ticketsSold: 420,
    ticketsMax: 1200,
    watchValue: 50000,
    drawDate: "2025-09-12T19:00:00Z",
  },
];

const MOCK_PAST = [
  {
    id: "na-5711",
    title: "Patek Philippe Nautilus 5711",
    image: "/images/patek-5711.webp",
    entryPrice: 35,
    ticketsBought: 6,
    result: "LOST",
    endedAt: "2025-07-12T19:30:00Z",
  },
  {
    id: "ro-15500st",
    title: "Audemars Piguet Royal Oak 15500ST",
    image: "/images/ap-15500st.webp",
    entryPrice: 28,
    ticketsBought: 10,
    result: "WON",
    endedAt: "2025-06-30T18:00:00Z",
  },
  {
    id: "rx-126610lv",
    title: "Rolex Submariner ‘Hulk’ 126610LV",
    image: "/images/rolex-hulk.webp",
    entryPrice: 20,
    ticketsBought: 4,
    result: "LOST",
    endedAt: "2025-06-05T17:00:00Z",
  },
];

const MOCK_TX = [
  {
    id: "tx-98721",
    date: "2025-08-01 12:15",
    item: "GMT-Master II Bruce Wayne — 5 tickets",
    amount: -75,
    method: "Visa •••• 4242",
    status: "Completed",
  },
  {
    id: "tx-98722",
    date: "2025-08-06 09:20",
    item: "Day-Date 40 Everose — 3 tickets",
    amount: -75,
    method: "PayPal",
    status: "Completed",
  },
  {
    id: "tx-98723",
    date: "2025-08-10 18:45",
    item: "Wallet Top-Up",
    amount: 150,
    method: "Mastercard •••• 9911",
    status: "Completed",
  },
];

// ---------- Page ----------
export default function MyBidsPage() {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("all"); // all / endingSoon / highValue
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = MOCK_ACTIVE.filter((b) =>
      (b.title + " " + b.ref).toLowerCase().includes(query.toLowerCase())
    );
    if (range === "endingSoon") {
      const in72h = Date.now() + 72 * 3600 * 1000;
      list = list.filter((b) => new Date(b.drawDate).getTime() <= in72h);
    }
    if (range === "highValue") {
      list = list.filter((b) => b.watchValue >= 50000);
    }
    return list;
  }, [query, range]);

  // Pagination (if you later have many items)
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0b0b] to-[#141414] text-white">
      {/* Top Bar */}
      <section className="border-b border-white/10 sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Crown className="text-[#d4af37]" />
            <h1 className="text-xl md:text-2xl font-semibold">
              My Bidding Dashboard
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search watches or refs…"
                className="pl-9 pr-3 py-2 rounded-xl bg-white/10 outline-none focus:ring-2 ring-[#d4af37] placeholder:text-white/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/60" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="bg-white/10 rounded-xl py-2 px-3 outline-none focus:ring-2 ring-[#d4af37]"
              >
                <option value="all">All active</option>
                <option value="endingSoon">Ending soon (≤72h)</option>
                <option value="highValue">High value (≥£50k)</option>
              </select>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] text-black font-semibold px-4 py-2 hover:brightness-105 transition">
              <Bell className="w-4 h-4" />
              Alerts
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/70">Active Bids</span>
            <Ticket className="text-[#d4af37]" />
          </div>
          <p className="text-3xl font-bold">{MOCK_ACTIVE.length}</p>
          <p className="text-white/50 mt-1">You’re in the game — keep going.</p>
        </div>
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/70">Potential Value</span>
            <TrendingUp className="text-[#d4af37]" />
          </div>
          <p className="text-3xl font-bold">
            £
            {MOCK_ACTIVE.reduce((s, b) => s + b.watchValue, 0).toLocaleString()}
          </p>
          <p className="text-white/50 mt-1">Across all your active contests.</p>
        </div>
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/70">Wallet</span>
            <Wallet className="text-[#d4af37]" />
          </div>
          <p className="text-3xl font-bold">£245</p>
          <p className="text-white/50 mt-1">Topped up & ready.</p>
        </div>
      </section>

      {/* Active Bids */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Active Bids</h2>
            <p className="text-white/50">
              Track your entries, time left, and ticket progress.
            </p>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15"
              >
                <ChevronLeft />
              </button>
              <span className="text-white/60 text-sm">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/15"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {current.map((b) => (
            <BidCard key={b.id} bid={b} />
          ))}
          {current.length === 0 && (
            <div className="col-span-full text-center py-16 border border-dashed border-white/10 rounded-2xl">
              <p className="text-white/60">
                No active bids matched your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Bids */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Past Bids</h2>
            <p className="text-white/50">
              Your recent results — keep an eye on those odds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_PAST.map((p) => (
            <PastCard key={p.id} past={p} />
          ))}
        </div>
      </section>

      {/* Transactions */}
      <section className="max-w-7xl mx-auto px-6 py-10 pb-16">
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold">
              Recent Activity
            </h3>
            <span className="text-sm text-white/50">
              Last {MOCK_TX.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left text-white/60">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Item</th>
                  <th className="px-6 py-3 font-medium">Method</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TX.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t border-white/10 hover:bg-white/5"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{t.date}</td>
                    <td className="px-6 py-4">{t.item}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{t.method}</td>
                    <td
                      className={classNames(
                        "px-6 py-4 whitespace-nowrap font-semibold",
                        t.amount < 0 ? "text-red-400" : "text-emerald-400"
                      )}
                    >
                      {t.amount < 0 ? "-" : "+"}£{Math.abs(t.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={classNames(
                          "text-xs px-2 py-1 rounded-full",
                          t.status === "Completed"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-yellow-500/15 text-yellow-300"
                        )}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------- Cards ----------
function BidCard({ bid }) {
  const { days, hours, mins, secs, isEnded } = useCountdown(bid.drawDate);
  const label =
    days > 3
      ? new Date(bid.drawDate).toLocaleString()
      : `${days}d ${hours}h ${mins}m ${secs}s`;

  return (
    <article className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={bid.image}
          alt={bid.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
        <div className="absolute left-4 top-4 backdrop-blur-sm bg-black/40 text-white text-xs px-3 py-1 rounded-full border border-white/10">
          Ref. {bid.ref}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">{bid.title}</h3>
            <p className="text-white/60 text-sm">
              Watch value £{bid.watchValue.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">Entry</p>
            <p className="text-xl font-bold tracking-tight">
              £{bid.entryPrice}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Tickets</span>
            <span className="text-white/80">
              {bid.ticketsSold.toLocaleString()} /{" "}
              {bid.ticketsMax.toLocaleString()} sold
            </span>
          </div>
          <ProgressBar value={bid.ticketsSold} max={bid.ticketsMax} />
          <p className="text-xs text-white/50">
            You bought <span className="text-white">{bid.ticketsBought}</span>{" "}
            tickets
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-black/30 border border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm">{isEnded ? "Closed" : "Draws in"}</span>
          </div>
          <div className="font-mono text-sm">
            {isEnded ? (
              <span className="text-red-300">Ended</span>
            ) : (
              <span>{label}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button className="flex-1 rounded-xl bg-[#d4af37] text-black font-semibold py-2 hover:brightness-105 transition">
            Increase Bids
          </button>
          <button className="flex-1 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 py-2 transition">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

function PastCard({ past }) {
  const badge =
    past.result === "WON" ? (
      <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-500/15 border border-emerald-500/20 text-xs px-2 py-1 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> WON
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-rose-300 bg-rose-500/15 border border-rose-500/20 text-xs px-2 py-1 rounded-full">
        <AlertTriangle className="w-3 h-3" /> LOST
      </span>
    );

  return (
    <article className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={past.image}
          alt={past.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
        <div className="absolute left-4 top-4">{badge}</div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold">{past.title}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Your tickets</span>
          <span className="text-white">{past.ticketsBought}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Entry price</span>
          <span className="text-white">£{past.entryPrice}</span>
        </div>
        <p className="text-xs text-white/50">
          Ended {new Date(past.endedAt).toLocaleString()}
        </p>
      </div>
    </article>
  );
}
