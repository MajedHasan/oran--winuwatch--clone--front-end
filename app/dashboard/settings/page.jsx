"use client";

import React, { useState } from "react";
import {
  FiEdit2,
  FiSave,
  FiUser,
  FiLock,
  FiCreditCard,
  FiToggleLeft,
  FiLogOut,
  FiEye,
} from "react-icons/fi";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    avatar: "",
    name: "Admin Name",
    email: "admin@example.com",
  });

  const [roles, setRoles] = useState([
    { id: 1, name: "Super Admin", description: "Full access" },
    { id: 2, name: "Manager", description: "Manage users and competitions" },
    { id: 3, name: "Support", description: "Limited access to support" },
  ]);

  const [gateways, setGateways] = useState([
    { id: 1, name: "Stripe", status: true },
    { id: 2, name: "PayPal", status: true },
    { id: 3, name: "CryptoPay", status: false },
  ]);

  const [features, setFeatures] = useState({
    maintenanceMode: false,
    darkMode: true,
  });

  const [auditLogs] = useState([
    { id: 1, action: "User John added", date: "14 Aug 2025", by: "Admin" },
    {
      id: 2,
      action: "Competition Rolex created",
      date: "13 Aug 2025",
      by: "Manager",
    },
    {
      id: 3,
      action: "Payment Gateway Stripe updated",
      date: "12 Aug 2025",
      by: "Super Admin",
    },
  ]);

  const toggleFeature = (feature) => {
    setFeatures({ ...features, [feature]: !features[feature] });
  };

  return (
    <div className="p-8 space-y-10">
      {/* Admin Profile */}
      <section className="bg-[#1f1f1f] rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">
          Admin Profile
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-4xl text-white/70">
              {profile.name[0]}
            </div>
            <input
              type="file"
              className="text-sm text-gray-300"
              onChange={(e) =>
                setProfile({ ...profile, avatar: e.target.files[0]?.name })
              }
            />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:gap-4 items-center">
              <FiUser className="text-yellow-400 w-5 h-5" />
              <input
                type="text"
                className="bg-[#121212] p-3 rounded-xl flex-1"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col md:flex-row md:gap-4 items-center">
              <FiLock className="text-yellow-400 w-5 h-5" />
              <input
                type="email"
                className="bg-[#121212] p-3 rounded-xl flex-1"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              <FiSave /> Save Profile
            </button>
          </div>
        </div>
      </section>

      {/* Roles & Permissions */}
      <section className="bg-[#1f1f1f] rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">
          Roles & Permissions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-white/60">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">{role.name}</td>
                  <td className="px-4 py-3">{role.description}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-lg flex items-center gap-1">
                      <FiEdit2 /> Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
                      <FiLogOut /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment Gateways */}
      <section className="bg-[#1f1f1f] rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">
          Payment Gateways
        </h2>
        <div className="space-y-4">
          {gateways.map((gateway) => (
            <div
              key={gateway.id}
              className="flex items-center justify-between bg-[#121212] p-4 rounded-xl shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                {gateway.name === "Stripe" && <FiCreditCard size={20} />}
                {gateway.name === "PayPal" && <FiEye size={20} />}
                {gateway.name === "CryptoPay" && <FiLock size={20} />}
                <span className="ml-2">{gateway.name}</span>
              </div>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gateway.status}
                  onChange={() =>
                    setGateways(
                      gateways.map((g) =>
                        g.id === gateway.id ? { ...g, status: !g.status } : g
                      )
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Toggles */}
      <section className="bg-[#1f1f1f] rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">
          Feature Toggles
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#121212] p-4 rounded-xl shadow hover:shadow-lg">
            <span>Maintenance Mode</span>
            <input
              type="checkbox"
              checked={features.maintenanceMode}
              onChange={() => toggleFeature("maintenanceMode")}
              className="toggle toggle-primary"
            />
          </div>
          <div className="flex items-center justify-between bg-[#121212] p-4 rounded-xl shadow hover:shadow-lg">
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={features.darkMode}
              onChange={() => toggleFeature("darkMode")}
              className="toggle toggle-primary"
            />
          </div>
        </div>
      </section>

      {/* Audit Logs */}
      <section className="bg-[#1f1f1f] rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Audit Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-white/60">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Performed By</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">{log.date}</td>
                  <td className="px-4 py-3">{log.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
