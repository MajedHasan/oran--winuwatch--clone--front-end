"use client";

import React, { useState, useMemo } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";

// Mock Transactions Data
const mockTransactions = [
  {
    id: 1,
    user: "John Doe",
    type: "Deposit",
    method: "Credit Card",
    amount: "£500",
    status: "Pending",
    date: "21 Aug 2025",
  },
  {
    id: 2,
    user: "Jane Smith",
    type: "Withdrawal",
    method: "PayPal",
    amount: "£200",
    status: "Approved",
    date: "20 Aug 2025",
  },
  {
    id: 3,
    user: "Mike Johnson",
    type: "Deposit",
    method: "Crypto",
    amount: "£1000",
    status: "Rejected",
    date: "19 Aug 2025",
  },
  {
    id: 4,
    user: "Alice Brown",
    type: "Withdrawal",
    method: "Credit Card",
    amount: "£350",
    status: "Pending",
    date: "18 Aug 2025",
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalType, setModalType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const openModal = (transaction, type) => {
    setSelectedTransaction(transaction);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
    setModalType("");
  };

  const handleApprove = (id) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, status: "Approved" } : t))
    );
    closeModal();
  };

  const handleReject = (id) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, status: "Rejected" } : t))
    );
    closeModal();
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    closeModal();
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          (filterType === "All" || t.type === filterType) &&
          (filterStatus === "All" || t.status === filterStatus) &&
          (t.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.method.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => b.id - a.id);
  }, [transactions, filterType, filterStatus, searchTerm]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by user or method"
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option>All</option>
          <option>Deposit</option>
          <option>Withdrawal</option>
        </select>
        <select
          className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-xl">
        <table className="min-w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Method</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map((t) => (
              <tr
                key={t.id}
                className="border-b border-gray-700 hover:bg-gray-700/50 transition"
              >
                <td className="px-6 py-3">{t.user}</td>
                <td className="px-6 py-3">{t.type}</td>
                <td className="px-6 py-3">{t.method}</td>
                <td className="px-6 py-3">{t.amount}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      t.status === "Approved"
                        ? "bg-green-500/20 text-green-300"
                        : t.status === "Rejected"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-3">{t.date}</td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => openModal(t, "view")}
                    className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
                  >
                    <FiEye />
                  </button>
                  {t.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(t.id)}
                        className="bg-green-700 p-2 rounded-lg hover:bg-green-600"
                      >
                        <FiCheckCircle />
                      </button>
                      <button
                        onClick={() => handleReject(t.id)}
                        className="bg-red-700 p-2 rounded-lg hover:bg-red-600"
                      >
                        <FiXCircle />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => openModal(t, "delete")}
                    className="bg-gray-700 p-2 rounded-lg hover:bg-gray-600"
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
      {selectedTransaction && (
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
                <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
                <p>
                  <strong>User:</strong> {selectedTransaction.user}
                </p>
                <p>
                  <strong>Type:</strong> {selectedTransaction.type}
                </p>
                <p>
                  <strong>Method:</strong> {selectedTransaction.method}
                </p>
                <p>
                  <strong>Amount:</strong> {selectedTransaction.amount}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTransaction.status}
                </p>
                <p>
                  <strong>Date:</strong> {selectedTransaction.date}
                </p>
              </>
            )}

            {modalType === "delete" && (
              <>
                <h2 className="text-xl font-bold mb-4 text-red-500">
                  Confirm Delete
                </h2>
                <p>Are you sure you want to delete this transaction?</p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleDelete(selectedTransaction.id)}
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
