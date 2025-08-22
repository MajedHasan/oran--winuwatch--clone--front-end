// app/dashboard/layout.jsx
"use client";

import React, { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiSettings,
  FiList,
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiHelpCircle,
  FiMail,
  FiAward,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { label: "Dashboard", icon: <FiHome />, href: "/dashboard" },
  { label: "Users", icon: <FiUsers />, href: "/dashboard/users" },
  { label: "Competitions", icon: <FiList />, href: "/dashboard/competitions" },
  { label: "Biddings", icon: <FiClock />, href: "/dashboard/biddings" }, // clock fits bidding timelines
  {
    label: "Transactions",
    icon: <FiDollarSign />,
    href: "/dashboard/transactions",
  },
  { label: "Faq", icon: <FiHelpCircle />, href: "/dashboard/faq" }, // better than settings
  { label: "Contact", icon: <FiMail />, href: "/dashboard/contact" }, // mail for messages
  { label: "Winners", icon: <FiAward />, href: "/dashboard/winner" }, // award fits winners
  { label: "Settings", icon: <FiSettings />, href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth token from localStorage or cookies
    localStorage.removeItem("token"); // or your auth key
    router.push("/auth/login"); // redirect to login
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-950 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {!collapsed && (
            <h1 className="font-bold text-xl text-yellow-400">Admin Panel</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-yellow-400"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto mt-4">
          {sidebarItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition ${
                !collapsed ? "text-white" : "justify-center"
              } rounded-lg`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-gray-950 p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <FiBell className="text-xl text-white" />
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://i.pravatar.cc/40?img=12"
                alt="Admin"
                className="w-8 h-8 rounded-full border border-gray-700"
              />
              <span className="hidden md:block">Super Admin</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
            >
              <FiLogOut />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
