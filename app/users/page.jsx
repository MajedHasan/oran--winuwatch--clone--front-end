"use client";

import React from "react";
import {
  FiArrowUpRight,
  FiArrowDownRight,
  FiClock,
  FiGift,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

function Sparkline({ values = [3, 6, 4, 8, 7, 10, 9] }) {
  const max = Math.max(...values);
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

export default function DashboardHome() {
  const stats = [
    {
      label: "Active Entries",
      value: "12",
      delta: "+3",
      up: true,
      icon: <FiTrendingUp />,
    },
    {
      label: "Total Wins",
      value: "02",
      delta: "+1",
      up: true,
      icon: <FiTrendingUp />,
    },
    {
      label: "Wallet Balance",
      value: "£1,240",
      delta: "−£60",
      up: false,
      icon: <FiTrendingDown />,
    },
    {
      label: "Next Draw In",
      value: "18h 24m",
      icon: <FiClock />,
    },
  ];

  const recentBiddings = [
    {
      name: "Rolex Submariner Hulk",
      tickets: 3,
      amount: "£75",
      date: "21 Aug 2025",
      status: "Pending",
    },
    {
      name: "Patek Philippe Nautilus",
      tickets: 5,
      amount: "£125",
      date: "19 Aug 2025",
      status: "Confirmed",
    },
    {
      name: "Audemars Piguet Royal Oak",
      tickets: 2,
      amount: "£50",
      date: "16 Aug 2025",
      status: "Failed",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting + CTA */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-shadow">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome back,{" "}
            <span className="text-yellow-400 drop-shadow-lg">Collector</span>
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
          <Sparkline />
          <p className="mt-2 text-sm text-white/70">
            Win rate trend (last 30 days)
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
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
                {recentBiddings.map((row, i) => (
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
                ))}
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
