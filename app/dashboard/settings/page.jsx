"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  FiEdit2,
  FiSave,
  FiUser,
  FiLock,
  FiCreditCard,
  FiLogOut,
  FiEye,
} from "react-icons/fi";

/**
 * SettingsPage
 * - Uses only api (your axios instance)
 * - Reads token from localStorage client-side
 * - Uses real endpoints where available:
 *    GET /api/users/me       -> profile
 *    PUT /api/users/me       -> update profile (multipart if avatar)
 *    GET /api/payments       -> list payment methods (gateway list)
 *    POST /api/payments      -> add payment method
 *    DELETE /api/payments/:id-> remove payment method
 * - Roles / Features / Audit logs: stored in localStorage (no server routes provided)
 */

export default function SettingsPage() {
  // client-only flag to avoid SSR/localStorage during server render
  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState(null);

  // loading and error states
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState(null);

  // Profile
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "", // url or path
  });
  const [avatarFile, setAvatarFile] = useState(null);

  // Payment Gateways (from /api/payments)
  const [gateways, setGateways] = useState([]);
  const [addingGateway, setAddingGateway] = useState(false);
  const [newGatewayName, setNewGatewayName] = useState("");
  const [newGatewayProvider, setNewGatewayProvider] = useState("");

  // Roles & Permissions (localStorage backed - replace with API if available)
  const [roles, setRoles] = useState(() => {
    try {
      const raw =
        typeof window !== "undefined" && localStorage.getItem("admin_roles");
      return raw
        ? JSON.parse(raw)
        : [
            { id: 1, name: "Super Admin", description: "Full access" },
            {
              id: 2,
              name: "Manager",
              description: "Manage users & competitions",
            },
            { id: 3, name: "Support", description: "Support staff" },
          ];
    } catch {
      return [];
    }
  });

  // Features (local toggles)
  const [features, setFeatures] = useState(() => {
    try {
      const raw =
        typeof window !== "undefined" && localStorage.getItem("admin_features");
      return raw ? JSON.parse(raw) : { maintenanceMode: false, darkMode: true };
    } catch {
      return { maintenanceMode: false, darkMode: true };
    }
  });

  // Audit logs (local)
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const raw =
        typeof window !== "undefined" && localStorage.getItem("admin_audit");
      return raw
        ? JSON.parse(raw)
        : [
            {
              id: Date.now() - 86400000 * 1,
              action: "Initial setup",
              date: new Date().toISOString(),
              by: "system",
            },
          ];
    } catch {
      return [];
    }
  });

  // --- Initialization (client-side only) ---
  useEffect(() => {
    // Client-only initialization
    const t =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(t);
    setInitialized(true);
  }, []);

  // Fetch server data once token+client ready
  useEffect(() => {
    if (!initialized) return;
    let canceled = false;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        // Profile
        try {
          const res = await api.get("/users/me", { headers });
          if (!canceled && res?.data) {
            setProfile({
              name: res.data.name || "",
              email: res.data.email || "",
              avatar: res.data.avatar || "",
            });
          }
        } catch (err) {
          // if 401 or not found, ignore for now (admin might not be logged in)
          console.warn(
            "Failed to load profile:",
            err?.response?.status || err.message
          );
        }

        // Payment methods (treat them as gateways list)
        try {
          const r = await api.get("/payments", { headers });
          if (!canceled) {
            // API may return array; normalize to { id, name, provider, status }
            const data = Array.isArray(r.data) ? r.data : r.data.items || [];
            // map to expected UI shape
            setGateways(
              data.map((g) => ({
                id: g._id || g.id || `${g.provider}-${g.name}`,
                name: g.name || g.provider || "Gateway",
                provider: g.provider || g.name || "unknown",
                status: g.status !== undefined ? g.status : true,
                raw: g,
              }))
            );
          }
        } catch (err) {
          console.warn("Failed to load payment methods:", err?.message);
        }
      } catch (err) {
        setError("Failed to fetch settings");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      canceled = true;
    };
  }, [initialized, token]);

  // Persist roles/features/audit to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("admin_roles", JSON.stringify(roles));
    } catch {}
  }, [roles]);

  useEffect(() => {
    try {
      localStorage.setItem("admin_features", JSON.stringify(features));
    } catch {}
  }, [features]);

  useEffect(() => {
    try {
      localStorage.setItem("admin_audit", JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  // --- Profile handlers ---
  const handleAvatarFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setAvatarFile(f);
      // show quick preview (not uploaded yet)
      setProfile((p) => ({ ...p, avatar: URL.createObjectURL(f) }));
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setError(null);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // if avatar file, send multipart/form-data
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        fd.append("name", profile.name);
        fd.append("email", profile.email);
        // server must accept multipart for /api/users/me - if not, fallback below
        const res = await api.put("/users/me", fd, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        if (res?.data) {
          setProfile((p) => ({ ...p, avatar: res.data.avatar || p.avatar }));
          addAudit(`Updated profile (with avatar)`, "You");
          alert("Profile saved");
        }
      } else {
        // JSON update
        const res = await api.put(
          "/users/me",
          { name: profile.name, email: profile.email },
          { headers }
        );
        if (res?.data) {
          setProfile((p) => ({
            ...p,
            name: res.data.name || profile.name,
            email: res.data.email || profile.email,
          }));
          addAudit("Updated profile", "You");
          alert("Profile saved");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. See console.");
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Payment gateways (mapped to your /api/payments) ---
  const addGateway = async () => {
    if (!newGatewayProvider && !newGatewayName) {
      alert("Provide provider/name");
      return;
    }
    setAddingGateway(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // call POST /api/payments with provider/name
      const payload = {
        provider: newGatewayProvider,
        name: newGatewayName,
        status: true,
      };
      const res = await api.post("/payments", payload, { headers });
      // normalize response item
      const g = res?.data;
      setGateways((prev) => [
        ...prev,
        {
          id: g._id || Date.now().toString(),
          name: g.name || g.provider || newGatewayName,
          provider: g.provider || newGatewayProvider,
          status: g.status !== undefined ? g.status : true,
          raw: g,
        },
      ]);
      setNewGatewayName("");
      setNewGatewayProvider("");
      addAudit(
        `Added payment gateway ${payload.provider || payload.name}`,
        "You"
      );
    } catch (err) {
      console.error("Add gateway failed", err);
      alert("Failed to add gateway (check console).");
    } finally {
      setAddingGateway(false);
    }
  };

  const removeGateway = async (id) => {
    if (!confirm("Remove this gateway?")) return;
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      // if gateway came from server, it has raw._id or id
      const g = gateways.find((x) => x.id === id);
      if (g?.raw?._id || g?.raw?.id) {
        const serverId = g.raw._id || g.raw.id;
        await api.delete(`/payments/${serverId}`, { headers });
      }
      setGateways((prev) => prev.filter((x) => x.id !== id));
      addAudit(`Removed gateway ${g?.provider || g?.name || id}`, "You");
    } catch (err) {
      console.error("Remove gateway failed", err);
      alert("Failed to remove gateway (check console).");
    }
  };

  const toggleGatewayStatus = async (id) => {
    // There is no update endpoint in your payments routes — fallback to local toggle + re-add if you prefer
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: !g.status } : g))
    );
    addAudit(`Toggled gateway ${id} status`, "You");
    // NOTE: If your server supports update via PUT /api/payments/:id -> implement it here.
  };

  // --- Roles (local) ---
  const addRole = (name, desc) => {
    const id = Date.now();
    setRoles((r) => [...r, { id, name, description: desc }]);
    addAudit(`Added role "${name}"`, "You");
  };
  const updateRole = (id, payload) => {
    setRoles((r) => r.map((x) => (x.id === id ? { ...x, ...payload } : x)));
    addAudit(`Edited role id:${id}`, "You");
  };
  const deleteRole = (id) => {
    if (!confirm("Delete role?")) return;
    setRoles((r) => r.filter((x) => x.id !== id));
    addAudit(`Deleted role id:${id}`, "You");
  };

  // --- Features (local) ---
  const toggleFeature = (key) => {
    setFeatures((f) => {
      const next = { ...f, [key]: !f[key] };
      addAudit(`Feature ${key} set to ${next[key]}`, "You");
      return next;
    });
  };

  // --- Audit logs (local) ---
  const addAudit = (action, by = "system") => {
    const entry = {
      id: Date.now(),
      action,
      date: new Date().toISOString(),
      by,
    };
    setAuditLogs((a) => [entry, ...a].slice(0, 200)); // keep last 200
  };

  // --- Small helpers for UI ---
  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  if (!initialized) {
    // keep server/client consistent; don't access localStorage during SSR
    return null;
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Admin Settings</h1>
        <div className="text-sm text-white/60">
          {loading ? "Loading..." : "Settings"}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-700/20 text-red-300">{error}</div>
      )}

      {/* Profile */}
      <section className="bg-[#0f1112] p-6 rounded-2xl border border-white/6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Admin Profile</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-56 flex-shrink-0">
            <div className="w-44 h-44 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center mb-3">
              {profile.avatar ? (
                // show preview
                // avoid burst of URL.createObjectURL on each render by storing preview url earlier
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl text-white/40">
                  {(profile.name || "A")[0]}
                </div>
              )}
            </div>

            <label className="block text-xs text-white/60 mb-1">
              Upload avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFile}
              className="text-sm text-white/70 w-full"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs text-white/60">Name</label>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-white/50"
                placeholder="Admin Name"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60">Email</label>
              <input
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-white/50"
                placeholder="admin@example.com"
                type="email"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  // reset to original (refetch)
                  setInitialized(false);
                  setInitialized(true);
                }}
                className="px-4 py-2 rounded-lg bg-white/6"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold"
              >
                {savingProfile ? (
                  "Saving..."
                ) : (
                  <>
                    <FiSave className="inline mr-2" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-[#0f1112] p-6 rounded-2xl border border-white/6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Roles & Permissions</h2>
          <button
            onClick={() => {
              const name = prompt("Role name");
              if (!name) return;
              const desc = prompt("Short description") || "";
              addRole(name, desc);
            }}
            className="px-3 py-1 rounded bg-yellow-400 text-black"
          >
            Add Role
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-white/60">
              <tr>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className="border-t border-white/6">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.description}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        const name = prompt("Role name", r.name);
                        if (!name) return;
                        const desc = prompt("Description", r.description) || "";
                        updateRole(r.id, { name, description: desc });
                      }}
                      className="px-2 py-1 rounded bg-white/6"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRole(r.id)}
                      className="px-2 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-white/60"
                    colSpan={3}
                  >
                    No roles defined
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment Gateways */}
      <section className="bg-[#0f1112] p-6 rounded-2xl border border-white/6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Payment Gateways</h2>
          <div className="flex gap-2">
            <input
              placeholder="Provider (stripe)"
              value={newGatewayProvider}
              onChange={(e) => setNewGatewayProvider(e.target.value)}
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
            <input
              placeholder="Display name"
              value={newGatewayName}
              onChange={(e) => setNewGatewayName(e.target.value)}
              className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
            />
            <button
              onClick={addGateway}
              disabled={addingGateway}
              className="px-3 py-2 rounded bg-yellow-400 text-black"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {gateways.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-white/6"
            >
              <div className="flex items-center gap-3">
                <FiCreditCard />
                <div>
                  <div className="font-semibold">{g.name}</div>
                  <div className="text-xs text-white/60">{g.provider}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!g.status}
                    onChange={() => toggleGatewayStatus(g.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-white/70">Enabled</span>
                </label>
                <button
                  onClick={() => removeGateway(g.id)}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {gateways.length === 0 && (
            <div className="text-white/60">No gateways connected</div>
          )}
        </div>
      </section>

      {/* Feature toggles */}
      <section className="bg-[#0f1112] p-6 rounded-2xl border border-white/6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Feature Toggles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-gray-900 rounded-lg flex items-center justify-between border border-white/6">
            <div>
              <div className="font-semibold">Maintenance Mode</div>
              <div className="text-xs text-white/60">
                Disable site for maintenance
              </div>
            </div>
            <button
              onClick={() => toggleFeature("maintenanceMode")}
              className={`px-3 py-1 rounded ${
                features.maintenanceMode
                  ? "bg-yellow-400 text-black"
                  : "bg-white/6"
              }`}
            >
              {features.maintenanceMode ? "ON" : "OFF"}
            </button>
          </div>

          <div className="p-3 bg-gray-900 rounded-lg flex items-center justify-between border border-white/6">
            <div>
              <div className="font-semibold">Dark Mode (UI)</div>
              <div className="text-xs text-white/60">
                Toggle admin UI dark mode
              </div>
            </div>
            <button
              onClick={() => toggleFeature("darkMode")}
              className={`px-3 py-1 rounded ${
                features.darkMode ? "bg-yellow-400 text-black" : "bg-white/6"
              }`}
            >
              {features.darkMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </section>

      {/* Audit logs */}
      <section className="bg-[#0f1112] p-6 rounded-2xl border border-white/6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Audit Logs</h2>
          <div className="text-sm text-white/60">
            Last {auditLogs.length} events
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-white/60">
              <tr>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">By</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((l) => (
                <tr key={l.id} className="border-t border-white/6">
                  <td className="px-4 py-2">{l.action}</td>
                  <td className="px-4 py-2">{formatDate(l.date)}</td>
                  <td className="px-4 py-2">{l.by}</td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-white/60"
                    colSpan={3}
                  >
                    No logs
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
