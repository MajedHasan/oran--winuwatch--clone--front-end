"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiGrid,
  FiUser,
  FiTrendingUp,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiBell,
  FiShield,
} from "react-icons/fi";

const nav = [
  { href: "/users", label: "Overview", icon: <FiGrid /> },
  { href: "/users/profile", label: "Profile", icon: <FiUser /> },
  { href: "/users/bidding", label: "My Biddings", icon: <FiTrendingUp /> },
  { href: "/users/my-biddings", label: "My Biddings", icon: <FiTrendingUp /> },
  { href: "/users/wallet", label: "Wallet", icon: <FiCreditCard /> },
  { href: "/users/settings", label: "Settings", icon: <FiSettings /> },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check login on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token || !userData) {
      router.push("/auth/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const title = useMemo(() => {
    const match = nav.find((n) => pathname === n.href);
    return match?.label ?? "Overview";
  }, [pathname]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0f] via-[#0e0e10] to-[#0b0b0d] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <FiMenu />
            </button>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-600 shadow-lg shadow-yellow-500/20" />
            <span className="font-bold tracking-wide">Win U Watch</span>
            <span className="mx-2 text-white/30">/</span>
            <span className="text-white/80">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex h-10 px-3 items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
              <FiBell className="opacity-80" />
              <span className="text-sm">Notifications</span>
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition">
              <FiShield />
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-4 font-semibold text-black shadow-lg hover:brightness-110"
            >
              <FiLogOut />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block col-span-3 xl:col-span-2">
          <nav className="sticky top-20 space-y-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    active
                      ? "bg-white/10 border border-white/10 shadow-inner"
                      : "hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`text-lg ${
                      active
                        ? "text-yellow-400"
                        : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      active ? "text-white" : "text-white/80"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Drawer (mobile) */}
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[78%] max-w-xs bg-[#0e0e10] border-r border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600" />
                  <span className="font-semibold">Dashboard</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <FiX />
                </button>
              </div>
              <nav className="space-y-2">
                {nav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                        active ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`${
                          active
                            ? "text-yellow-400"
                            : "text-white/70 group-hover:text-white"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`${active ? "text-white" : "text-white/85"}`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 xl:col-span-10">
          {children}
        </main>
      </div>
    </div>
  );
}
