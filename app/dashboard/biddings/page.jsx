"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiEdit, FiTrash2, FiEye, FiX } from "react-icons/fi";
import api from "@/lib/axios";

export default function BiddingsPage() {
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [modalType, setModalType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [competitions, setCompetitions] = useState([]);

  // Fetch competitions list for select and filter
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.get("/competitions/select", { headers });
        setCompetitions(res.data);
      } catch (err) {
        console.error("Failed to fetch competitions", err);
      }
    };
    fetchCompetitions();
  }, []);

  // Fetch bids from API
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.get("/bids", {
          headers,
          params:
            competitionFilter !== "All"
              ? { competitionId: competitionFilter }
              : {},
        });

        setBids(res.data.items || res.data); // adapt to API response
      } catch (err) {
        console.error("Failed to fetch bids", err);
      }
    };
    fetchBids();
  }, [competitionFilter]);

  const openModal = (bid, type) => {
    setSelectedBid(bid);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedBid(null);
    setModalType("");
  };

  const handleDelete = async (id) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.delete(`/bids/${id}`, { headers });
      setBids(bids.filter((b) => b._id !== id));
      closeModal();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = async (updatedBid) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.put(`/bids/${updatedBid._id}`, updatedBid, {
        headers,
      });
      setBids(bids.map((b) => (b._id === updatedBid._id ? res.data : b)));
      closeModal();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Filtering & search
  const filteredBids = useMemo(() => {
    return bids
      .filter(
        (b) =>
          (competitionFilter === "All" ||
            b.competition?.title === competitionFilter) &&
          (b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.competition?.title
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bids, competitionFilter, searchTerm]);

  const totalPages = Math.ceil(filteredBids.length / itemsPerPage);
  const displayedBids = filteredBids.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDrawWinners = async (competitionId) => {
    if (!confirm("Are you sure you want to draw winners for this competition?"))
      return;

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await api.post(
        `/competitions/extra/${competitionId}/draw`,
        {},
        { headers }
      );

      alert(
        `Winners drawn! Ticket numbers: ${res.data.winners
          .map((w) => w.ticketNumber)
          .join(", ")}`
      );

      // Refresh bids after draw
      const bidsRes = await api.get("/bids", {
        headers,
        params: { competitionId },
      });
      setBids(bidsRes.data.items || bidsRes.data);
    } catch (err) {
      console.error("Draw failed", err);
      alert(err.response?.data?.message || "Failed to draw winners");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">All Biddings</h1>

      {/* Search / Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by user or competition"
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={competitionFilter}
            onChange={(e) => setCompetitionFilter(e.target.value)}
          >
            <option value="All">All</option>
            {competitions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          {competitionFilter !== "All" && (
            <button
              onClick={() => handleDrawWinners(competitionFilter)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg"
            >
              Draw Winners
            </button>
          )}
        </div>
      </div>

      {/* Bids Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-xl">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">Competition</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Tickets</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedBids.map((bid) => (
              <tr
                key={bid._id}
                className="border-b border-gray-700 hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-3">{bid.competition?.title}</td>
                <td className="px-6 py-3">
                  {bid.user?.name || bid.user?.email}
                </td>
                <td className="px-6 py-3">{bid.tickets}</td>
                <td className="px-6 py-3">£{bid.totalAmount}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      bid.status === "confirmed"
                        ? "bg-green-500/20 text-green-300"
                        : bid.status === "failed"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {bid.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {new Date(bid.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => openModal(bid, "view")}
                    className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    <FiEye />
                  </button>
                  <button
                    onClick={() => openModal(bid, "edit")}
                    className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => openModal(bid, "delete")}
                    className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedBid && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-yellow-400"
            >
              <FiX size={24} />
            </button>

            {modalType === "view" && (
              <>
                <h2 className="text-xl font-bold mb-4">View Bid</h2>
                <p>
                  <strong>Competition:</strong> {selectedBid.competition?.title}
                </p>
                <p>
                  <strong>User:</strong>{" "}
                  {selectedBid.user?.name || selectedBid.user?.email}
                </p>
                <p>
                  <strong>Tickets:</strong> {selectedBid.tickets}
                </p>
                <p>
                  <strong>Total Amount:</strong> £{selectedBid.totalAmount}
                </p>
                <p>
                  <strong>Status:</strong> {selectedBid.status}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedBid.createdAt).toLocaleString()}
                </p>
              </>
            )}

            {modalType === "edit" && (
              <>
                <h2 className="text-xl font-bold mb-4">Edit Bid</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const updatedBid = {
                      ...selectedBid,
                      tickets: e.target.tickets.value,
                      totalAmount: e.target.totalAmount.value,
                      status: e.target.status.value,
                    };
                    handleEdit(updatedBid);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label>Tickets</label>
                    <input
                      name="tickets"
                      type="number"
                      defaultValue={selectedBid.tickets}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label>Total Amount</label>
                    <input
                      name="totalAmount"
                      type="number"
                      defaultValue={selectedBid.totalAmount}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label>Status</label>
                    <select
                      name="status"
                      defaultValue={selectedBid.status}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option>pending</option>
                      <option>confirmed</option>
                      <option>failed</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2 rounded-lg mt-2"
                  >
                    Save Changes
                  </button>
                </form>
              </>
            )}

            {modalType === "delete" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-red-500">
                  Confirm Delete
                </h2>
                <p>Are you sure you want to delete this bid?</p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleDelete(selectedBid._id)}
                    className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-700 px-5 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
