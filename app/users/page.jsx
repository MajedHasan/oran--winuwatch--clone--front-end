// app/(user)/dashboard/page.jsx  (or wherever your component file lives)
"use client";

import React, { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiArrowDownRight,
  FiClock,
  FiGift,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import api from "@/lib/axios";

function Sparkline({ values = [3, 6, 4, 8, 7, 10, 9] }) {
  const max = Math.max(...values, 1);
  const points = values
    .map(
      (v, i) => `${(i / (values.length - 1)) * 100},${100 - (v / max) * 100}`
    )
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="h-12 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="url(#g)"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Small skeleton helpers (keeps markup inline for easy copy/paste) */
function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="h-4 w-24 bg-white/10 rounded mb-4 animate-pulse" />
      <div className="flex items-center justify-between">
        <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
        <div className="h-6 w-6 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="h-4 w-12 bg-white/10 rounded mt-3 animate-pulse" />
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr className="border-t border-white/10">
      <td className="px-6 py-4">
        <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-8 bg-white/10 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
      </td>
    </tr>
  );
}

export default function DashboardHome() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [recentBiddings, setRecentBiddings] = useState([]);
  const [sparklineValues, setSparklineValues] = useState([
    3, 6, 4, 8, 7, 10, 9,
  ]);

  // Get token client-side to avoid hydration mismatch
  useEffect(() => {
    const t =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(t);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.get("/userDashboard/stats", { headers }); // GET /api/dashboard/stats
        if (!mounted) return;
        const d = res.data || {};

        // Stats array kept same shape as your original to minimize change
        const stats = [
          {
            label: "Active Entries",
            value: d.activeEntries ?? 0,
            delta: d.activeEntriesDelta ?? null,
            up: (d.activeEntriesDelta ?? 0) >= 0,
            icon: <FiTrendingUp />,
          },
          {
            label: "Total Wins",
            value: d.totalWins ?? 0,
            delta: d.totalWinsDelta ?? null,
            up: (d.totalWinsDelta ?? 0) >= 0,
            icon: <FiTrendingUp />,
          },
          {
            label: "Wallet Balance",
            value: `£${(d.walletBalance ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`,
            delta:
              d.walletBalanceDelta != null
                ? `${d.walletBalanceDelta >= 0 ? "+" : ""}£${
                    d.walletBalanceDelta
                  }`
                : null,
            up: (d.walletBalanceDelta ?? 0) >= 0,
            icon: <FiTrendingDown />,
          },
          {
            label: "Next Draw In",
            value: d.nextDrawIn ?? "N/A",
            icon: <FiClock />,
          },
        ];

        setStatsData({ stats, userName: d.userName || "Collector" });
        setRecentBiddings(
          (d.recentBiddings || []).map((b) => ({
            name: b.competition?.title || "—",
            tickets: b.tickets || 0,
            amount: `£${Number(b.amount || 0).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`,
            date: new Date(b.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            status:
              (b.status &&
                String(b.status).charAt(0).toUpperCase() +
                  String(b.status).slice(1)) ||
              "Pending",
          }))
        );

        if (Array.isArray(d.winRateTrend) && d.winRateTrend.length > 0) {
          setSparklineValues(d.winRateTrend);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  // keep local references for rendering
  const stats = statsData?.stats ?? [
    { label: "Active Entries", value: "—", icon: <FiTrendingUp /> },
    { label: "Total Wins", value: "—", icon: <FiTrendingUp /> },
    { label: "Wallet Balance", value: "—", icon: <FiTrendingDown /> },
    { label: "Next Draw In", value: "—", icon: <FiClock /> },
  ];

  const userName = statsData?.userName ?? "Collector";

  return (
    <div className="space-y-8">
      {/* Greeting + CTA */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-shadow">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome back,{" "}
            <span className="text-yellow-400 drop-shadow-lg">{userName}</span>
          </h1>
          <p className="text-white/70 mt-2 text-lg">
            Track your entries, follow upcoming draws, and manage your account —
            all in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/competitions"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-3 text-black font-semibold shadow-lg hover:brightness-110 transition"
            >
              Browse Competitions <FiArrowUpRight />
            </a>
            <a
              href="/users/wallet"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 hover:bg-white/15 transition"
            >
              Top Up Wallet
            </a>
          </div>
        </div>
        <div className="w-full md:w-72 lg:w-80 rounded-2xl border border-white/10 bg-black/30 p-4">
          <Sparkline values={sparklineValues} />
          <p className="mt-2 text-sm text-white/70">
            Win rate trend (last 30 days)
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? // show skeletons if loading
            [0, 1, 2, 3].map((i) => <StatSkeleton key={i} />)
          : stats.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition"
              >
                <div className="text-sm text-white/70">{s.label}</div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-yellow-400">{s.icon}</div>
                </div>
                {s.delta && (
                  <div
                    className={`mt-1 inline-flex items-center gap-1 text-sm ${
                      s.up ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {s.up ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    {s.delta}
                  </div>
                )}
              </div>
            ))}
      </section>

      {/* Main Dashboard Columns */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Biddings */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] shadow-lg hover:shadow-2xl transition">
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
            <h3 className="font-semibold text-lg">Recent Biddings</h3>
            <a
              href="/users/my-biddings"
              className="text-sm text-yellow-400 hover:underline"
            >
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-white/60">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">
                    Competition
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Tickets</th>
                  <th className="px-6 py-3 text-left font-medium">Amount</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // show 4 skeleton rows while loading
                  [0, 1, 2, 3].map((i) => <RowSkeleton key={i} />)
                ) : recentBiddings.length > 0 ? (
                  recentBiddings.map((row, i) => (
                    <tr
                      key={i}
                      className="border-t border-white/10 hover:bg-white/[0.04] transition"
                    >
                      <td className="px-6 py-3">{row.name}</td>
                      <td className="px-6 py-3">{row.tickets}</td>
                      <td className="px-6 py-3">{row.amount}</td>
                      <td className="px-6 py-3">{row.date}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.status === "Confirmed"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : row.status === "Failed"
                              ? "bg-rose-500/15 text-rose-300"
                              : "bg-yellow-500/15 text-yellow-300"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  // empty state
                  <tr className="border-t border-white/10">
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-sm text-white/60"
                    >
                      No recent biddings.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Perks / Promotions */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-yellow-400/10 via-amber-400/10 to-orange-400/10 p-6 shadow-lg hover:shadow-2xl transition">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-lg">
              <FiGift />
            </span>
            <div>
              <h4 className="font-semibold text-lg">Member Perks</h4>
              <p className="text-white/70 text-sm">
                Exclusive discounts & early access
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li>• 10% off on bulk tickets (10+)</li>
            <li>• Early access to limited competitions</li>
            <li>• Birthday surprise entries</li>
          </ul>
          <a
            href="/feed"
            className="mt-5 inline-flex rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
          >
            Explore community feed
          </a>
        </div>
      </section>
    </div>
  );
}
