"use client";

import React from "react";
import { FiLock, FiBell, FiGlobe, FiTrash2 } from "react-icons/fi";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Security */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-bold mb-1">Settings</h2>
        <p className="text-white/70 text-sm mb-6">
          Control your account preferences
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiLock className="text-yellow-400" />
              <h3 className="font-semibold">Security</h3>
            </div>
            <label className="flex items-center justify-between text-sm">
              <span>Two-factor authentication</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="mt-3 flex items-center justify-between text-sm">
              <span>Login alerts</span>
              <input type="checkbox" />
            </label>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiBell className="text-yellow-400" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <label className="flex items-center justify-between text-sm">
              <span>New competition alerts</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label className="mt-3 flex items-center justify-between text-sm">
              <span>Results & winner updates</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiGlobe className="text-yellow-400" />
              <h3 className="font-semibold">Regional</h3>
            </div>
            <div className="text-sm">
              <label className="text-white/60 text-xs">Currency</label>
              <select className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500">
                <option>GBP (£)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
            <div className="mt-3 text-sm">
              <label className="text-white/60 text-xs">Timezone</label>
              <select className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500">
                <option>Europe/London</option>
                <option>Europe/Paris</option>
                <option>America/New_York</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5">
          <h4 className="font-semibold">Danger Zone</h4>
          <p className="text-sm text-white/70">
            Delete your account and data permanently.
          </p>
          <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2 text-rose-200 hover:bg-rose-500/30">
            <FiTrash2 /> Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}
