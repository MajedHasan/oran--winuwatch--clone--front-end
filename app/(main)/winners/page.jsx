"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { FiSearch } from "react-icons/fi";

export default function WinnersPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchWinners = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const { data } = await api.get("/winners", {
        params: { page, limit: 12, search },
        headers,
      });

      if (append) {
        setWinners((prev) => [...prev, ...(data || [])]);
      } else {
        setWinners(data || []);
      }

      setHasMore(data.hasMore);
    } catch (err) {
      console.error(err);
      setError("Failed to load winners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, [search]);

  const sortedWinners = [...winners].sort((a, b) => {
    if (sortBy === "latest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "highestBid") return (b.bidAmount || 0) - (a.bidAmount || 0);
    return 0;
  });

  return (
    <div className=" bg-[#0b0b0b] text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">
        Competition Winners
      </h1>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-start md:items-center">
        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 w-full md:w-1/2">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search winners or competitions..."
            className="bg-transparent outline-none w-full text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setSortBy("latest")}
            className={`px-4 py-2 rounded ${
              sortBy === "latest" ? "bg-yellow-400 text-black" : "bg-gray-700"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy("highestBid")}
            className={`px-4 py-2 rounded ${
              sortBy === "highestBid"
                ? "bg-yellow-400 text-black"
                : "bg-gray-700"
            }`}
          >
            Highest Bid
          </button>
        </div>
      </div>

      {/* Winners Grid */}
      {loading && <p className="text-gray-400">Loading winners...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && sortedWinners.length === 0 && (
        <p className="text-gray-400">No winners found.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedWinners.map((winner) => (
          <div
            key={winner._id}
            className="relative rounded-xl overflow-hidden border border-[#d4af37]/30 shadow-lg h-[420px] group"
          >
            {/* Image */}
            <Image
              src={`http://localhost:5001${
                winner.profileImage || "/default-avatar.png"
              }`}
              alt={winner.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />

            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 opacity-100 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-xs uppercase text-[#ffd700] tracking-widest mb-1">
                Winner of
              </p>
              <h3 className="text-lg font-semibold text-white leading-snug">
                {winner.competition?.title || winner.competition}
              </h3>
              <p className="mt-1 text-base font-medium text-white">
                {winner.name}
              </p>
              <p className="text-sm text-[#ffd700]">
                {winner.prize} <span className="text-white">Value</span>
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {new Date(winner.createdAt).toLocaleDateString()}{" "}
                {new Date(winner.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchWinners(nextPage, true);
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
