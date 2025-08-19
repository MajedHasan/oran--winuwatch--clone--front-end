"use client";

import React from "react";
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiUpload } from "react-icons/fi";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold">Your Profile</h2>
        <p className="text-white/70 text-sm">
          Manage your personal information
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col items-center">
            <div className="relative">
              <img
                alt="Avatar"
                src="https://i.pravatar.cc/200?img=12"
                className="h-28 w-28 rounded-2xl object-cover"
              />
              <button className="absolute -bottom-2 -right-2 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15">
                <FiUpload /> Change
              </button>
            </div>
            <p className="mt-4 font-semibold">John Carter</p>
            <p className="text-white/60 text-sm">Gold Member</p>
          </div>

          {/* Details */}
          <form className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60">Full Name</label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                defaultValue="John Carter"
              />
            </div>
            <div>
              <label className="text-xs text-white/60">Username</label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                defaultValue="johncarter"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 flex items-center gap-2">
                <FiMail /> Email
              </label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                defaultValue="john@watch.io"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 flex items-center gap-2">
                <FiPhone /> Phone
              </label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                defaultValue="+44 20 7946 1234"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-white/60 flex items-center gap-2">
                <FiMapPin /> Address
              </label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                defaultValue="221B Baker Street, London"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-black font-semibold shadow">
                <FiEdit2 /> Save Changes
              </button>
              <button className="inline-flex rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-semibold mb-4">Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Email Alerts", "SMS Alerts", "Weekly Digest"].map((p, i) => (
            <label
              key={i}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span>{p}</span>
              <input type="checkbox" defaultChecked={i !== 1} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
