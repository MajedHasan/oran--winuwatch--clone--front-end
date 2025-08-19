"use client";

import React, { useState, useMemo } from "react";
import {
  FiUser,
  FiCreditCard,
  FiClock,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiUserX,
  FiUserCheck,
  FiUsers,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const mockUsers = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "Admin" : "Collector",
  status: i % 5 === 0 ? "Banned" : "Active",
  wallet: (Math.random() * 1200).toFixed(2),
  biddings: Math.floor(Math.random() * 20),
  dailyActivity: Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 10)
  ),
}));

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const usersPerPage = 10;

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const openModal = (user, type) => {
    setSelectedUser({ ...user });
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const toggleBan = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Banned" ? "Active" : "Banned" }
          : u
      )
    );
  };

  const handleSaveEdit = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
    );
    closeModal();
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#121212] text-white space-y-8">
      {/* Search */}
      <div className="flex items-center gap-3">
        <FiSearch className="w-5 h-5 text-white/50" />
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 rounded-lg bg-[#1f1f1f] border border-white/10 w-full focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1f1f1f] rounded-2xl p-5 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <FiUsers className="text-yellow-400 w-6 h-6" />
            <div>Total Users</div>
          </div>
          <div className="mt-3 text-2xl font-bold">{users.length}</div>
        </div>
        <div className="bg-[#1f1f1f] rounded-2xl p-5 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <FiCreditCard className="text-yellow-400 w-6 h-6" />
            <div>Total Wallet</div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            £
            {users.reduce((sum, u) => sum + parseFloat(u.wallet), 0).toFixed(2)}
          </div>
        </div>
        <div className="bg-[#1f1f1f] rounded-2xl p-5 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <FiClock className="text-yellow-400 w-6 h-6" />
            <div>Active Users</div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            {users.filter((u) => u.status === "Active").length}
          </div>
        </div>
        <div className="bg-[#1f1f1f] rounded-2xl p-5 shadow hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <FiUserCheck className="text-yellow-400 w-6 h-6" />
            <div>Biddings Placed</div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            {users.reduce((sum, u) => sum + u.biddings, 0)}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1f1f1f] rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#2a2a2a] text-white/70">
              <tr>
                {["name", "email", "role", "status", "wallet", "biddings"].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left font-medium cursor-pointer select-none"
                      onClick={() => requestSort(col)}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                      {sortConfig.key === col &&
                        (sortConfig.direction === "asc" ? (
                          <FiChevronUp className="inline w-4 h-4 ml-1" />
                        ) : (
                          <FiChevronDown className="inline w-4 h-4 ml-1" />
                        ))}
                    </th>
                  )
                )}
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3 flex items-center gap-1">
                    {user.role === "Admin" ? (
                      <FiUserCheck className="text-yellow-400 w-4 h-4" />
                    ) : (
                      <FiUser className="text-white/70 w-4 h-4" />
                    )}
                    {user.role}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">£{user.wallet}</td>
                  <td className="px-6 py-3">{user.biddings}</td>
                  <td className="px-6 py-3 flex items-center gap-2">
                    <button
                      className="p-2 rounded-full hover:bg-white/10 transition"
                      onClick={() => openModal(user, "view")}
                      title="View Profile"
                    >
                      <FiEye />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-white/10 transition"
                      onClick={() => openModal(user, "edit")}
                      title="Edit User"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-white/10 transition"
                      onClick={() => toggleBan(user.id)}
                      title={
                        user.status === "Active" ? "Ban User" : "Unban User"
                      }
                    >
                      {user.status === "Active" ? <FiUserX /> : <FiUserCheck />}
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-white/10 transition"
                      onClick={() => openModal(user, "wallet")}
                      title="Wallet Overview"
                    >
                      <FiCreditCard />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t border-white/10">
          <span className="text-sm text-white/70">
            Showing {displayedUsers.length} of {filteredUsers.length} users
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-yellow-400 text-black"
                    : "bg-white/10 hover:bg-white/20"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Transition appear show={!!modalType} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#1f1f1f] p-6 text-left align-middle shadow-xl transition-all">
                  {selectedUser && modalType === "view" && (
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white">
                        {selectedUser.name} - Profile
                      </Dialog.Title>
                      <p className="mt-2 text-white/70">{selectedUser.email}</p>
                      <p className="mt-1 text-white/70">
                        Role: {selectedUser.role}
                      </p>
                      <p className="mt-1 text-white/70">
                        Status: {selectedUser.status}
                      </p>
                      <p className="mt-1 text-white/70">
                        Wallet: £{selectedUser.wallet}
                      </p>
                      <p className="mt-1 text-white/70">
                        Total Biddings: {selectedUser.biddings}
                      </p>
                    </div>
                  )}
                  {selectedUser && modalType === "edit" && (
                    <div className="space-y-3">
                      <Dialog.Title className="text-lg font-bold text-white">
                        Edit {selectedUser.name}
                      </Dialog.Title>
                      <input
                        className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-white/10 focus:outline-none"
                        value={selectedUser.name}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            name: e.target.value,
                          })
                        }
                        placeholder="Name"
                      />
                      <input
                        className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-white/10 focus:outline-none"
                        value={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
                        }
                        placeholder="Email"
                      />
                      <select
                        className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-white/10 focus:outline-none"
                        value={selectedUser.role}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            role: e.target.value,
                          })
                        }
                      >
                        <option value="Collector">Collector</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedUser && modalType === "wallet" && (
                    <div className="space-y-4">
                      <Dialog.Title className="text-lg font-bold text-white">
                        {selectedUser.name} - Wallet
                      </Dialog.Title>
                      <p className="text-white/70">
                        Balance: £{selectedUser.wallet}
                      </p>
                      <Line
                        data={{
                          labels: [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ],
                          datasets: [
                            {
                              label: "Daily Activity",
                              data: selectedUser.dailyActivity,
                              borderColor: "#facc15",
                              backgroundColor: "rgba(250,204,21,0.2)",
                            },
                          ],
                        }}
                      />
                      <div className="flex gap-2 mt-3">
                        <button className="px-4 py-2 bg-yellow-400 text-black rounded-lg">
                          Deposit
                        </button>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
                          Withdraw
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
