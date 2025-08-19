"use client";

import React, { useState } from "react";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiArrowRight,
} from "react-icons/fi";

export default function BiddingPage() {
  const [bids, setBids] = useState([
    {
      id: 1,
      lottery: "Luxury Watch August 2025",
      bidAmount: 25,
      tickets: 5,
      status: "Active",
      endDate: "2025-08-20",
    },
    {
      id: 2,
      lottery: "Premium Watch July 2025",
      bidAmount: 50,
      tickets: 10,
      status: "Won",
      endDate: "2025-07-30",
    },
    {
      id: 3,
      lottery: "Classic Watch June 2025",
      bidAmount: 25,
      tickets: 2,
      status: "Lost",
      endDate: "2025-06-28",
    },
    {
      id: 4,
      lottery: "Sport Watch September 2025",
      bidAmount: 30,
      tickets: 3,
      status: "Active",
      endDate: "2025-09-05",
    },
  ]);

  const summary = {
    totalBids: bids.length,
    active: bids.filter((b) => b.status === "Active").length,
    won: bids.filter((b) => b.status === "Won").length,
    lost: bids.filter((b) => b.status === "Lost").length,
  };

  const [filter, setFilter] = useState("All");

  const filteredBids = bids.filter((b) =>
    filter === "All" ? true : b.status === filter
  );

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-[#121212] to-[#1c1c1c] text-white">
      <h1 className="text-4xl font-bold text-[#d4af37] mb-8">
        My Bidding Dashboard
      </h1>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            icon: <FiTrendingUp size={36} />,
            title: "Total Bids",
            value: summary.totalBids,
            color: "text-[#d4af37]",
          },
          {
            icon: <FiClock size={36} />,
            title: "Active Bids",
            value: summary.active,
            color: "text-blue-400",
          },
          {
            icon: <FiCheckCircle size={36} />,
            title: "Won",
            value: summary.won,
            color: "text-green-400",
          },
          {
            icon: <FiXCircle size={36} />,
            title: "Lost",
            value: summary.lost,
            color: "text-red-400",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-[#1f1f1f] p-6 rounded-3xl shadow-xl hover:shadow-2xl transition flex flex-col items-center text-center"
          >
            <div className={`${card.color} mb-3`}>{card.icon}</div>
            <p className="text-gray-400">{card.title}</p>
            <p className="text-2xl font-bold">{card.value}</p>
            {card.title === "Active Bids" && summary.totalBids > 0 && (
              <div className="w-full mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-400"
                  style={{
                    width: `${(summary.active / summary.totalBids) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Filters */}
      <section className="flex gap-4 mb-6 flex-wrap">
        {["All", "Active", "Won", "Lost"].map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === f
                ? "bg-[#d4af37] text-black"
                : "bg-[#1f1f1f] text-white hover:bg-yellow-400 hover:text-black transition"
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </section>

      {/* Active Bids Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {filteredBids.map((bid) => (
          <div
            key={bid.id}
            className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">{bid.lottery}</h2>
              <p className="text-gray-300 mb-1">
                Bid Amount:{" "}
                <span className="font-semibold">£{bid.bidAmount}</span>
              </p>
              <p className="text-gray-300 mb-1">
                Tickets: <span className="font-semibold">{bid.tickets}</span>
              </p>
              <p className="text-gray-300 mb-2">End Date: {bid.endDate}</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  bid.status === "Active"
                    ? "bg-blue-400 text-black"
                    : bid.status === "Won"
                    ? "bg-green-400 text-black"
                    : "bg-red-400 text-black"
                }`}
              >
                {bid.status}
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              {bid.status === "Active" && (
                <button className="bg-[#d4af37] text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition flex items-center gap-2">
                  Place More Bids <FiArrowRight />
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Bid History Timeline */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[#d4af37] mb-6">Bid History</h2>
        <div className="relative border-l border-gray-700 ml-4">
          {bids
            .filter((b) => b.status !== "Active")
            .map((bid) => (
              <div key={bid.id} className="mb-6 ml-6 relative">
                <span
                  className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full ${
                    bid.status === "Won" ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <div className="bg-[#1f1f1f] p-4 rounded-2xl shadow-lg">
                  <p className="font-semibold">{bid.lottery}</p>
                  <p className="text-gray-300">Bid Amount: £{bid.bidAmount}</p>
                  <p className="text-gray-300">Tickets: {bid.tickets}</p>
                  <p className="text-gray-300">End Date: {bid.endDate}</p>
                  <p
                    className={`mt-1 font-bold ${
                      bid.status === "Won" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {bid.status}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Tips */}
      <section className="p-6 bg-[#1f1f1f] rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#d4af37] mb-4">Bidding Tips</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Always check remaining tickets to know your odds.</li>
          <li>Join multiple lotteries to increase chances of winning.</li>
          <li>Track active bids regularly to avoid missing deadlines.</li>
          <li>Use the dashboard to place additional bids strategically.</li>
          <li>Review past results to improve your bidding strategy.</li>
        </ul>
      </section>
    </div>
  );
}
