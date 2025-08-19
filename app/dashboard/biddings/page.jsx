"use client";

import React, { useState, useMemo } from "react";
import { FiClock, FiEdit, FiTrash2, FiEye, FiX } from "react-icons/fi";

// Mock Bids Data
const mockBids = [
  {
    id: 1,
    competition: "Rolex Submariner Hulk",
    user: "John Doe",
    tickets: 3,
    bidPrice: "£75",
    winningPrice: "£20,000",
    status: "Pending",
    date: "21 Aug 2025",
  },
  {
    id: 2,
    competition: "Patek Philippe Nautilus",
    user: "Jane Smith",
    tickets: 5,
    bidPrice: "£125",
    winningPrice: "£50,000",
    status: "Confirmed",
    date: "19 Aug 2025",
  },
  {
    id: 3,
    competition: "Audemars Piguet Royal Oak",
    user: "Mike Johnson",
    tickets: 2,
    bidPrice: "£50",
    winningPrice: "£35,000",
    status: "Failed",
    date: "16 Aug 2025",
  },
  {
    id: 4,
    competition: "Rolex Submariner Hulk",
    user: "Alice Brown",
    tickets: 4,
    bidPrice: "£100",
    winningPrice: "£20,000",
    status: "Confirmed",
    date: "22 Aug 2025",
  },
  // Add more mock data as needed
];

export default function BiddingsPage() {
  const [bids, setBids] = useState(mockBids);
  const [selectedBid, setSelectedBid] = useState(null);
  const [modalType, setModalType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [competitionFilter, setCompetitionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const openModal = (bid, type) => {
    setSelectedBid(bid);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedBid(null);
    setModalType("");
  };

  const handleDelete = (id) => {
    setBids(bids.filter((b) => b.id !== id));
    closeModal();
  };

  const handleEdit = (updatedBid) => {
    setBids(bids.map((b) => (b.id === updatedBid.id ? updatedBid : b)));
    closeModal();
  };

  const filteredBids = useMemo(() => {
    return bids
      .filter(
        (b) =>
          (competitionFilter === "All" ||
            b.competition === competitionFilter) &&
          (b.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.competition.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => b.id - a.id);
  }, [bids, competitionFilter, searchTerm]);

  const totalPages = Math.ceil(filteredBids.length / itemsPerPage);
  const displayedBids = filteredBids.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        <select
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={competitionFilter}
          onChange={(e) => setCompetitionFilter(e.target.value)}
        >
          <option>All</option>
          {[...new Set(bids.map((b) => b.competition))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Bids Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-xl">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">Competition</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Tickets</th>
              <th className="px-6 py-3">Bid Price</th>
              <th className="px-6 py-3">Winning Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedBids.map((bid) => (
              <tr
                key={bid.id}
                className="border-b border-gray-700 hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-3">{bid.competition}</td>
                <td className="px-6 py-3">{bid.user}</td>
                <td className="px-6 py-3">{bid.tickets}</td>
                <td className="px-6 py-3">{bid.bidPrice}</td>
                <td className="px-6 py-3">{bid.winningPrice}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      bid.status === "Confirmed"
                        ? "bg-green-500/20 text-green-300"
                        : bid.status === "Failed"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {bid.status}
                  </span>
                </td>
                <td className="px-6 py-3">{bid.date}</td>
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
          className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600"
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
                  <strong>Competition:</strong> {selectedBid.competition}
                </p>
                <p>
                  <strong>User:</strong> {selectedBid.user}
                </p>
                <p>
                  <strong>Tickets:</strong> {selectedBid.tickets}
                </p>
                <p>
                  <strong>Bid Price:</strong> {selectedBid.bidPrice}
                </p>
                <p>
                  <strong>Winning Price:</strong> {selectedBid.winningPrice}
                </p>
                <p>
                  <strong>Status:</strong> {selectedBid.status}
                </p>
                <p>
                  <strong>Date:</strong> {selectedBid.date}
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
                      bidPrice: e.target.bidPrice.value,
                      winningPrice: e.target.winningPrice.value,
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
                    <label>Bid Price</label>
                    <input
                      name="bidPrice"
                      type="text"
                      defaultValue={selectedBid.bidPrice}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <div>
                    <label>Winning Price</label>
                    <input
                      name="winningPrice"
                      type="text"
                      defaultValue={selectedBid.winningPrice}
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
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Failed</option>
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
                    onClick={() => handleDelete(selectedBid.id)}
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
