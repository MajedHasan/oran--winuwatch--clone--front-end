"use client";

import React, { useEffect, useState } from "react";
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiUpload } from "react-icons/fi";
import api from "@/lib/axios";

export default function ProfilePage() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // server user object
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // UI-only fields (you kept them in design). We try to populate them sensibly:
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [membership, setMembership] = useState(""); // maps to role or custom label

  // editable form fields that map to your backend controller
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // get token client-side to avoid SSR/hydration mismatch
  useEffect(() => {
    const t =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(t);
  }, []);

  // fetch profile once token available
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await api.get("/users/me", { headers }); // matches your routes
        if (!mounted) return;
        const u = res.data;

        setUser(u);
        // map server fields
        setName(u.name || "");
        setEmail(u.email || "");
        // password left blank for security
        setPassword("");
        setMembership(
          u.role ? (u.role === "admin" ? "Admin" : "Member") : "Member"
        );
        setUsername(
          // fallback: prefer explicit username if present in user object, otherwise derive
          u.username ||
            (u.email
              ? u.email.split("@")[0]
              : u.name?.replace(/\s+/g, "").toLowerCase() || "")
        );
        setPhone(u.phone || "");
        setAddress(u.address || "");
        setAvatarPreview(u.avatar || null); // note: user model doesn't contain avatar by default
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        if (mounted) setMsg({ type: "error", text: "Failed to load profile." });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  // avatar file selection (local preview only — no server endpoint provided in your controller)
  const onSelectAvatar = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    // TODO: if you want to persist avatar to server, implement a new endpoint (e.g. PUT /users/me/avatar => multer)
  };

  // Save form (name, email, password) -> hits your existing updateProfile controller
  const onSave = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setSaving(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // Only send fields the controller supports (name, email, password)
      const payload = {};
      if (name !== (user?.name || "")) payload.name = name;
      if (email !== (user?.email || "")) payload.email = email;
      if (password) payload.password = password;

      if (Object.keys(payload).length === 0) {
        setMsg({ type: "info", text: "No changes to save." });
        setSaving(false);
        return;
      }

      const res = await api.put("/users/me", payload, { headers });
      // controller returns { id, name, email } on success — but we'll fetch fresh profile to sync all fields
      setMsg({ type: "success", text: "Profile updated successfully." });

      // refetch profile
      try {
        const refetch = await api.get("/users/me", { headers });
        setUser(refetch.data);
        setName(refetch.data.name || "");
        setEmail(refetch.data.email || "");
      } catch (e) {
        console.warn("Refetch failed:", e);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      const msgText =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to update profile.";
      setMsg({ type: "error", text: String(msgText) });
    } finally {
      setSaving(false);
      setPassword(""); // clear password input for safety
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 h-80"></div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 h-40"></div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-white">Unable to load profile.</p>;
  }

  return (
    <div className="space-y-6">
      {/* notification */}
      {msg.text && (
        <div
          className={`rounded-lg p-3 text-sm ${
            msg.type === "success"
              ? "bg-green-900/40 text-green-300 border border-green-800/40"
              : msg.type === "error"
              ? "bg-red-900/40 text-red-300 border border-red-800/40"
              : "bg-yellow-900/40 text-yellow-300 border border-yellow-800/40"
          }`}
        >
          {msg.text}
        </div>
      )}

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
                src={avatarPreview || "https://i.pravatar.cc/200?img=12"}
                className="h-28 w-28 rounded-2xl object-cover"
              />
              <label className="absolute -bottom-2 -right-2 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15 cursor-pointer">
                <FiUpload /> Change
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onSelectAvatar(e.target.files?.[0])}
                />
              </label>
            </div>

            <p className="mt-4 font-semibold">{user.name || "Unnamed"}</p>
            <p className="text-white/60 text-sm">
              {membership || (user.role === "admin" ? "Admin" : "Member")}
            </p>

            <div className="mt-4 text-sm text-white/70 space-y-1">
              <div>
                Wallet: £{(user.walletBalance ?? 0).toLocaleString("en-GB")}
              </div>
              <div>Status: {user.status || "active"}</div>
              <div className="text-xs text-gray-400">
                Joined:{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB")
                  : "—"}
              </div>
            </div>
          </div>

          {/* Details Form */}
          <form
            onSubmit={onSave}
            className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="text-xs text-white/60">Full Name</label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="text-xs text-white/60">Username</label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (client-side)"
              />
              <p className="text-xs text-white/60 mt-1">
                Note: username is client-side only unless you add server
                support.
              </p>
            </div>

            <div>
              <label className="text-xs text-white/60 flex items-center gap-2">
                <FiMail /> Email
              </label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 flex items-center gap-2">
                <FiPhone /> Phone
              </label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (client-side)"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-white/60 flex items-center gap-2">
                <FiMapPin /> Address
              </label>
              <input
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address (client-side)"
              />
            </div>

            <div>
              <label className="text-xs text-white/60">Role</label>
              <input
                readOnly
                className="mt-1 w-full rounded-xl bg-white/8 px-3 py-2 outline-none"
                value={user.role || "user"}
              />
            </div>

            <div>
              <label className="text-xs text-white/60">Change Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 text-black font-semibold shadow disabled:opacity-60"
              >
                <FiEdit2 /> {saving ? "Saving…" : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => {
                  // reset client-only fields back to server values
                  setName(user.name || "");
                  setEmail(user.email || "");
                  setPassword("");
                  setUsername(
                    user.username ||
                      (user.email ? user.email.split("@")[0] : "")
                  );
                  setPhone(user.phone || "");
                  setAddress(user.address || "");
                  setAvatarPreview(user.avatar || null);
                  setMsg({ type: "info", text: "Changes reverted." });
                  setTimeout(() => setMsg({ type: "", text: "" }), 2000);
                }}
                className="inline-flex rounded-xl bg-white/10 px-4 py-2 hover:bg-white/15"
              >
                Cancel
              </button>
            </div>
            <div className="sm:col-span-2 text-xs text-gray-400">
              Note: Only name, email and password are saved to server using your
              current API. Add server support to persist username, phone,
              address or avatar.
            </div>
          </form>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="font-semibold mb-4">Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Email Alerts", "SMS Alerts", "Weekly Digest"].map((p, i) => {
            // if server preferences object exists, try to read it; else default some values
            const checked = user.preferences
              ? Boolean(user.preferences[p])
              : i !== 1;
            return (
              <label
                key={i}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <span>{p}</span>
                <input type="checkbox" defaultChecked={checked} />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
