"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios"; // your axios instance
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [search, setSearch] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    user: "",
    type: "wallet_topup",
    direction: "credit",
    amount: 0,
    currency: "GBP",
    competition: "",
    bid: "",
    provider: "",
    status: "pending",
    balanceBefore: 0,
    balanceAfter: 0,
    metadata: "",
  });

  // Get token client-side to avoid hydration mismatch
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  // Fetch transactions
  useEffect(() => {
    if (!token) return;
    async function fetchTransactions() {
      setLoading(true);
      try {
        const res = await api.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [token]);

  // Add transaction
  const handleAdd = async () => {
    try {
      const res = await api.post("/transactions", newTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions([res.data, ...transactions]);
      setNewTransaction({
        user: "",
        type: "wallet_topup",
        direction: "credit",
        amount: 0,
        currency: "GBP",
        competition: "",
        bid: "",
        provider: "",
        status: "pending",
        balanceBefore: 0,
        balanceAfter: 0,
        metadata: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Edit transaction
  const handleUpdate = async () => {
    try {
      const res = await api.put(
        `/transactions/${editingTransaction._id}`,
        editingTransaction,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(
        transactions.map((t) => (t._id === res.data._id ? res.data : t))
      );
      setEditingTransaction(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.user.includes(search) ||
      t.type.includes(search) ||
      t.direction.includes(search) ||
      t.status.includes(search)
  );

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded flex items-center"
            onClick={handleAdd}
          >
            <FiPlus className="mr-2" /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Direction</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Currency</th>
                <th className="px-4 py-2">Provider</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Balance Before</th>
                <th className="px-4 py-2">Balance After</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="px-4 py-2">{t.user}</td>
                  <td className="px-4 py-2">{t.type}</td>
                  <td className="px-4 py-2">{t.direction}</td>
                  <td className="px-4 py-2">{t.amount}</td>
                  <td className="px-4 py-2">{t.currency}</td>
                  <td className="px-4 py-2">{t.provider || "-"}</td>
                  <td className="px-4 py-2">{t.status}</td>
                  <td className="px-4 py-2">{t.balanceBefore}</td>
                  <td className="px-4 py-2">{t.balanceAfter}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      className="bg-blue-600 px-2 py-1 rounded hover:bg-blue-500"
                      onClick={() => setEditingTransaction(t)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="bg-red-600 px-2 py-1 rounded hover:bg-red-500"
                      onClick={() => handleDelete(t._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="User"
                value={editingTransaction.user}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    user: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              />
              <input
                type="number"
                placeholder="Amount"
                value={editingTransaction.amount}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    amount: Number(e.target.value),
                  })
                }
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              />
              <select
                value={editingTransaction.type}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    type: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="wallet_topup">Wallet Topup</option>
                <option value="wallet_withdrawal">Wallet Withdrawal</option>
                <option value="ticket_purchase">Ticket Purchase</option>
                <option value="refund">Refund</option>
                <option value="prize_payout">Prize Payout</option>
                <option value="admin_adjustment">Admin Adjustment</option>
                <option value="fee">Fee</option>
              </select>
              <select
                value={editingTransaction.direction}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    direction: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
              <select
                value={editingTransaction.status}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    status: e.target.value,
                  })
                }
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setEditingTransaction(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
