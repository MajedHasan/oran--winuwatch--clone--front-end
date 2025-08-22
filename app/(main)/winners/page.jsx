"use client";

import React, { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">
        Competition Winners
      </h1>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
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
            className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            <div className="mb-4">
              <img
                src={`http://localhost:5001${
                  winner.user?.avatar ||
                  winner.profileImage ||
                  "/default-avatar.png"
                }`}
                alt={winner.user?.name || winner.name}
                className="w-full h-48 object-cover rounded-lg border-2 border-yellow-400"
              />
            </div>

            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              {winner.user?.name || winner.name}
            </h2>

            <p className="text-gray-300 mb-1">
              Competition:{" "}
              <span className="font-medium">
                {winner.competition?.title || winner.competitionTitle}
              </span>
            </p>
            <p className="text-gray-300 mb-1">
              Prize: <span className="font-medium">{winner.prize}</span>
            </p>
            {winner.bidAmount && (
              <p className="text-gray-300 mb-1">
                Winning Bid:{" "}
                <span className="font-medium">${winner.bidAmount}</span>
              </p>
            )}
            <p className="text-gray-400 text-sm mt-2">
              Date: {new Date(winner.createdAt).toLocaleDateString()}{" "}
              {new Date(winner.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
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
