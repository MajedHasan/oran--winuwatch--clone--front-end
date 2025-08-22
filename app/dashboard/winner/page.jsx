// app/dashboard/winners/page.jsx (or wherever you mount your admin winners page)
"use client";

import React, { useEffect, useState } from "react";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import api from "@/lib/axios";

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    prize: "",
    email: "",
    competition: "",
    profileImage: null,
  });
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Derive server base to render images (api.defaults.baseURL usually like http://localhost:5001/api)
  const serverBase =
    (api && api.defaults && api.defaults.baseURL
      ? api.defaults.baseURL.replace(/\/api\/?$/, "")
      : "") || "";

  // Get token client-side to avoid hydration mismatch
  useEffect(() => {
    const t =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(t);
  }, []);

  // Fetch winners (only after token is set so protected endpoints work)
  useEffect(() => {
    if (token === null) return; // wait until token is read (could be null if not logged in)
    fetchWinners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchWinners() {
    setLoading(true);
    setError(null);
    try {
      // If your GET /winners is public you can omit headers; sending token is harmless
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get("/winners", { headers });
      // support responses either as array or { items: [...] }
      setWinners(Array.isArray(res.data) ? res.data : res.data.items || []);
    } catch (err) {
      console.error("Error fetching winners:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load winners"
      );
    } finally {
      setLoading(false);
    }
  }

  // Handle form input change (text & file)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((s) => ({
        ...s,
        profileImage: files && files[0] ? files[0] : null,
      }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  // Open add form
  const openAddForm = () => {
    setEditingWinner(null);
    setFormData({
      name: "",
      prize: "",
      email: "",
      competition: "",
      profileImage: null,
    });
    setShowForm(true);
  };

  // Edit winner: prefill form
  const handleEdit = (winner) => {
    setEditingWinner(winner);
    setFormData({
      name: winner.name || "",
      prize: winner.prize || "",
      email: winner.email || "",
      competition: winner.competition || "",
      profileImage: null, // don't prefill File input for security - show preview instead
    });
    setShowForm(true);
  };

  // Delete winner
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this winner?")) return;
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.delete(`/winners/${id}`, { headers });
      await fetchWinners();
    } catch (err) {
      console.error("Error deleting winner:", err);
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  // Submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // basic validation
    if (!formData.name || !formData.prize) {
      setError("Name & prize are required");
      setSaving(false);
      return;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("prize", formData.prize);
      if (formData.email) fd.append("email", formData.email);
      if (formData.competition) fd.append("competition", formData.competition);
      if (formData.profileImage)
        fd.append("profileImage", formData.profileImage);

      if (editingWinner) {
        await api.put(`/winners/${editingWinner._id}`, fd, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/winners", fd, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      }

      setShowForm(false);
      setEditingWinner(null);
      setFormData({
        name: "",
        prize: "",
        email: "",
        competition: "",
        profileImage: null,
      });
      await fetchWinners();
    } catch (err) {
      console.error("Error saving winner:", err);
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Helper to build image URL from winner.profileImage (stored as /uploads/xyz.jpg or full URL)
  const buildImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://"))
      return imgPath;
    // some controllers store '/uploads/filename' or '/uploads/winners/filename'
    return `${serverBase}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Winners</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddForm}
              className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg shadow"
            >
              <FiPlus className="mr-2" /> Add Winner
            </button>
            <button
              onClick={fetchWinners}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Error / Loading */}
        {error && (
          <div className="mb-4 p-3 bg-red-700/20 text-red-300 rounded">
            {error}
          </div>
        )}
        {loading ? (
          <div className="mb-4 text-gray-400">Loading winners...</div>
        ) : (
          <>
            {/* Winners Table */}
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Prize</th>
                    <th className="p-3">Competition</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.length > 0 ? (
                    winners.map((winner) => (
                      <tr
                        key={winner._id}
                        className="border-b border-gray-700 hover:bg-gray-700/50"
                      >
                        <td className="p-3">
                          {winner.profileImage ? (
                            <img
                              src={buildImageUrl(winner.profileImage)}
                              alt={winner.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                              {winner.name ? winner.name[0] : "?"}
                            </div>
                          )}
                        </td>
                        <td className="p-3">{winner.name}</td>
                        <td className="p-3">{winner.prize}</td>
                        <td className="p-3">{winner.competition || "-"}</td>
                        <td className="p-3">
                          {new Date(winner.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(winner)}
                            className="p-2 rounded bg-yellow-600 hover:bg-yellow-700"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(winner._id)}
                            className="p-2 rounded bg-red-600 hover:bg-red-700"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-3 text-gray-400" colSpan="6">
                        No winners found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50 pt-24">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingWinner ? "Edit Winner" : "Add Winner"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingWinner(null);
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-300">Prize</label>
                  <input
                    type="text"
                    name="prize"
                    value={formData.prize}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-300">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-300">
                    Competition (optional)
                  </label>
                  <input
                    type="text"
                    name="competition"
                    value={formData.competition}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-300">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-300"
                  />
                  {/* preview of existing image when editing */}
                  {editingWinner && editingWinner.profileImage && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400">Current image:</p>
                      <img
                        src={buildImageUrl(editingWinner.profileImage)}
                        alt="current"
                        className="w-24 h-24 rounded-full object-cover mt-2"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingWinner(null);
                      setError(null);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : editingWinner ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
