"use client";

import React, { useEffect, useState } from "react";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiX, FiSave } from "react-icons/fi";
import api from "@/lib/axios";

/**
 * Competitions admin page (full)
 * - Uses api (imported from "@/lib/axios")
 * - Token read from localStorage (client-side)
 * - All model fields included
 * - Image uploads (FormData)
 * - VIP Packs dynamic UI
 * - Dark theme (input text white)
 */

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentCompetition, setCurrentCompetition] = useState(null); // for edit/view

  // form
  const emptyForm = {
    title: "",
    slug: "",
    description: "",
    images: [], // will be handled by files separately
    entryPrice: 25,
    watchValue: 10000,
    maxTickets: 2000,
    soldTickets: 0,
    drawDate: "",
    status: "active", // enum: draft, upcoming, active, completed
    // watch info
    brand: "",
    model: "",
    referenceNumber: "",
    movement: "",
    year: "",
    caliber: "",
    glass: "",
    bezelMaterial: "",
    braceletMaterial: "",
    papers: "",
    // tickets info
    maximumEntries: "",
    maximumWinners: "",
    // vip packs
    vipPacks: [], // array of { tickets, discount, chance }
  };
  const [form, setForm] = useState({ ...emptyForm });
  const [imageFiles, setImageFiles] = useState([]); // files to upload

  // token
  const [token, setToken] = useState("");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // fetch token and competitions (client-side only)
  useEffect(() => {
    const t =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    if (t) setToken(t);
    // fetch regardless of token — header will be empty if token not available
    fetchCompetitions(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch competitions
  async function fetchCompetitions(innerToken = null) {
    try {
      setLoading(true);
      const h = innerToken
        ? { Authorization: `Bearer ${innerToken}` }
        : headers;
      const res = await api.get("/competitions", {
        headers: { ...h, "Cache-Control": "no-cache" },
      });
      // backend listCompetitions returns { items, page, totalPages, total } in earlier controller
      const data = res?.data;
      const items = data?.items ?? data ?? [];
      setCompetitions(items);
    } catch (err) {
      console.error("fetchCompetitions:", err);
      alert("Failed to fetch competitions");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------
     Helpers to manage form
     --------------------------- */
  function handleChange(e) {
    const { name, value, type } = e.target;
    // keep raw strings; we'll convert when appending FormData
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleDateChange(e) {
    const { name, value } = e.target;
    // store ISO-ish date string (date input gives yyyy-mm-dd)
    setForm((s) => ({ ...s, [name]: value ? `${value}` : "" }));
  }

  // VIP packs handlers (tickets:number, discount:string, chance:string)
  function addVipPack() {
    setForm((s) => ({
      ...s,
      vipPacks: [
        ...(s.vipPacks || []),
        { tickets: "", discount: "", chance: "" },
      ],
    }));
  }
  function updateVipPack(idx, field, value) {
    const newVip = [...(form.vipPacks || [])];
    newVip[idx] = { ...newVip[idx], [field]: value };
    setForm((s) => ({ ...s, vipPacks: newVip }));
  }
  function removeVipPack(idx) {
    const newVip = [...(form.vipPacks || [])];
    newVip.splice(idx, 1);
    setForm((s) => ({ ...s, vipPacks: newVip }));
  }

  // image files (multiple)
  function onImageFilesChange(e) {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    // for preview in existing UI we could set form.images to previews if desired
  }

  /* ---------------------------
     Open modals
     --------------------------- */
  function openAddModal() {
    setCurrentCompetition(null);
    setForm({ ...emptyForm });
    setImageFiles([]);
    setIsAddEditOpen(true);
  }

  function openEditModal(comp) {
    // map backend fields to form; ensure strings for text/date fields
    setCurrentCompetition(comp);
    setForm({
      title: comp.title ?? "",
      slug: comp.slug ?? "",
      description: comp.description ?? "",
      entryPrice: comp.entryPrice ?? 25,
      watchValue: comp.watchValue ?? 10000,
      maxTickets: comp.maxTickets ?? comp.maximumEntries ?? 2000,
      soldTickets: comp.soldTickets ?? 0,
      drawDate: comp.drawDate ?? "",
      status: comp.status ?? "active",
      brand: comp.brand ?? "",
      model: comp.model ?? "",
      referenceNumber: comp.referenceNumber ?? "",
      movement: comp.movement ?? "",
      year: comp.year ?? "",
      caliber: comp.caliber ?? "",
      glass: comp.glass ?? "",
      bezelMaterial: comp.bezelMaterial ?? "",
      braceletMaterial: comp.braceletMaterial ?? "",
      papers: comp.papers ?? "",
      maximumEntries: comp.maximumEntries ?? comp.maxTickets ?? "",
      maximumWinners: comp.maximumWinners ?? "",
      vipPacks: comp.vipPacks ? comp.vipPacks.map((p) => ({ ...p })) : [],
      images: comp.images ?? [],
    });
    setImageFiles([]); // leave existing images on backend unless user uploads new ones
    setIsAddEditOpen(true);
  }

  function openViewModal(comp) {
    setCurrentCompetition(comp);
    setIsViewOpen(true);
  }

  function closeAllModals() {
    setIsAddEditOpen(false);
    setIsViewOpen(false);
    setCurrentCompetition(null);
    setImageFiles([]);
  }

  /* ---------------------------
     Prepare and submit form
     --------------------------- */
  function buildFormData() {
    const fd = new FormData();

    // Map form keys -> backend fields. Ensure we append at least empty string for numeric fields (avoids undefined -> NaN server-side)
    const safe = (v) => (v === undefined || v === null ? "" : v);

    // basic textual / numeric fields
    fd.append("title", safe(form.title));
    fd.append("slug", safe(form.slug));
    fd.append("description", safe(form.description));
    fd.append("entryPrice", safe(String(form.entryPrice ?? "")));
    fd.append("watchValue", safe(String(form.watchValue ?? "")));
    fd.append("maxTickets", safe(String(form.maxTickets ?? ""))); // model still has maxTickets
    fd.append("soldTickets", safe(String(form.soldTickets ?? "")));
    fd.append("drawDate", safe(form.drawDate));
    fd.append("status", safe(form.status));

    // watch info
    fd.append("brand", safe(form.brand));
    fd.append("model", safe(form.model));
    fd.append("referenceNumber", safe(form.referenceNumber));
    fd.append("movement", safe(form.movement));
    fd.append("year", safe(String(form.year ?? "")));
    fd.append("caliber", safe(form.caliber));
    fd.append("glass", safe(form.glass));
    fd.append("bezelMaterial", safe(form.bezelMaterial));
    fd.append("braceletMaterial", safe(form.braceletMaterial));
    fd.append("papers", safe(form.papers));

    // tickets info (backend expects maximumEntries & maximumWinners)
    fd.append(
      "maximumEntries",
      safe(String(form.maximumEntries ?? form.maxTickets ?? ""))
    );
    fd.append("maximumWinners", safe(String(form.maximumWinners ?? "")));

    // VIP packs -> JSON string (backend will JSON.parse)
    fd.append("vipPacks", JSON.stringify(form.vipPacks ?? []));

    // images files (append each file)
    (imageFiles || []).forEach((file) => {
      fd.append("images", file);
    });

    // If user didn't upload new files but form.images contains URLs (from existing comp), we don't need to append them;
    // backend updateCompetition replaces images if req.files exists; otherwise keeps existing comp.images.

    return fd;
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    try {
      const fd = buildFormData();
      if (currentCompetition && currentCompetition._id) {
        // edit
        await api.put(`/competitions/${currentCompetition._id}`, fd, {
          headers: { ...headers }, // axios & browser set correct content-type for FormData
        });
        alert("Competition updated");
      } else {
        // create
        await api.post("/competitions", fd, {
          headers: { ...headers },
        });
        alert("Competition created");
      }
      await fetchCompetitions();
      closeAllModals();
    } catch (err) {
      console.error("submit error:", err);
      // try to surface backend message
      const msg =
        err?.response?.data?.message || err?.message || "Failed to submit";
      alert(msg);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this competition? This cannot be undone.")) return;
    try {
      await api.delete(`/competitions/${id}`, { headers });
      alert("Deleted");
      fetchCompetitions();
    } catch (err) {
      console.error("delete error:", err);
      alert("Failed to delete competition");
    }
  }

  /* ---------------------------
     Filtered list
     --------------------------- */
  const filtered = (competitions || []).filter((c) =>
    (c?.title ?? "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  /* ---------------------------
     Render
     --------------------------- */
  return (
    <div className="p-6 bg-[#0b0b0c] min-h-screen text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Competitions</h1>
          <p className="text-sm text-white/70 mt-1">
            Manage competitions — add, edit, view, delete.
          </p>
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search competitions..."
            className="px-3 py-2 rounded bg-gray-800 text-white w-full md:w-80 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
          >
            <FiPlus /> Add
          </button>
        </div>
      </div>

      <div className="bg-[#0f0f10] border border-white/8 rounded-2xl p-4">
        {loading ? (
          <div className="text-white/70">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-white/60">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Draw Date</th>
                  <th className="px-4 py-3">Max Entries</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white/90">
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-white/60"
                    >
                      No competitions found
                    </td>
                  </tr>
                )}

                {filtered.map((c) => (
                  <tr
                    key={c._id}
                    className="border-t border-white/6 hover:bg-white/3 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold">
                        <img
                          src={`http://localhost:5001${c.images[0]}`}
                          alt=""
                          className="w-10 h-10 object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-xs text-white/60 mt-1">
                        {c.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {c.status === "active" ? (
                        <span className="bg-green-500 rounded px-2 py-1">
                          {c.status}
                        </span>
                      ) : c.status === "completed" ? (
                        <span className="bg-red-500 rounded px-2 py-1">
                          {c.status}
                        </span>
                      ) : c.status === "upcoming" ? (
                        <span className="bg-yellow-500 rounded px-2 py-1">
                          {c.status}
                        </span>
                      ) : (
                        <span className="bg-sky-500 rounded px-2 py-1">
                          {c.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.drawDate
                        ? new Date(c.drawDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {c.maximumEntries ?? c.maxTickets ?? "—"}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openViewModal(c)}
                        className="p-2 rounded-md bg-white/5 hover:bg-white/10"
                        title="View"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-2 rounded-md bg-white/5 hover:bg-white/10"
                        title="Edit"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                        title="Delete"
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
      </div>

      {/* ----------------------------
          Add / Edit Modal
         ---------------------------- */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeAllModals}
          />
          <div className="relative w-full max-w-4xl bg-[#0f1112] border border-white/8 rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {currentCompetition
                  ? `Edit — ${currentCompetition.title}`
                  : "Add Competition"}
              </h3>
              <button
                onClick={closeAllModals}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* main fields grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
                  required
                />
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="Slug"
                  className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={3}
                  className="col-span-1 md:col-span-2 w-full p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="entryPrice"
                  type="number"
                  value={form.entryPrice}
                  onChange={handleChange}
                  placeholder="Entry Price"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="watchValue"
                  type="number"
                  value={form.watchValue}
                  onChange={handleChange}
                  placeholder="Watch Value"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="maxTickets"
                  type="number"
                  value={form.maxTickets}
                  onChange={handleChange}
                  placeholder="maxTickets (legacy)"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="soldTickets"
                  type="number"
                  value={form.soldTickets}
                  onChange={handleChange}
                  placeholder="Sold Tickets"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="drawDate"
                  type="date"
                  value={
                    form.drawDate ? ("" + form.drawDate).split("T")[0] : ""
                  }
                  onChange={handleDateChange}
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Watch info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Model"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="referenceNumber"
                  value={form.referenceNumber}
                  onChange={handleChange}
                  placeholder="Reference Number"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="movement"
                  value={form.movement}
                  onChange={handleChange}
                  placeholder="Movement"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="Year"
                  type="number"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="caliber"
                  value={form.caliber}
                  onChange={handleChange}
                  placeholder="Caliber"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="glass"
                  value={form.glass}
                  onChange={handleChange}
                  placeholder="Glass"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="bezelMaterial"
                  value={form.bezelMaterial}
                  onChange={handleChange}
                  placeholder="Bezel Material"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="braceletMaterial"
                  value={form.braceletMaterial}
                  onChange={handleChange}
                  placeholder="Bracelet Material"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="papers"
                  value={form.papers}
                  onChange={handleChange}
                  placeholder="Papers"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
              </div>

              {/* Tickets info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="maximumEntries"
                  type="number"
                  value={form.maximumEntries}
                  onChange={handleChange}
                  placeholder="Maximum Entries"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
                <input
                  name="maximumWinners"
                  type="number"
                  value={form.maximumWinners}
                  onChange={handleChange}
                  placeholder="Maximum Winners"
                  className="p-3 rounded-lg bg-gray-800 text-white outline-none"
                />
              </div>

              {/* VIP Packs enhanced */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">VIP Packs</h4>
                  <button
                    type="button"
                    onClick={addVipPack}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    + Add pack
                  </button>
                </div>
                <div className="grid gap-3">
                  {(form.vipPacks || []).length === 0 && (
                    <div className="text-white/60">No VIP packs yet</div>
                  )}
                  {(form.vipPacks || []).map((pack, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-center p-3 rounded border border-white/6 bg-gray-900"
                    >
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="Tickets"
                          value={pack.tickets}
                          onChange={(e) =>
                            updateVipPack(idx, "tickets", e.target.value)
                          }
                          className="p-2 rounded bg-gray-800 text-white outline-none"
                        />
                        <input
                          placeholder="Discount (eg. 10% off)"
                          value={pack.discount}
                          onChange={(e) =>
                            updateVipPack(idx, "discount", e.target.value)
                          }
                          className="p-2 rounded bg-gray-800 text-white outline-none"
                        />
                        <input
                          placeholder="Chance (eg. 1/100 chance to win)"
                          value={pack.chance}
                          onChange={(e) =>
                            updateVipPack(idx, "chance", e.target.value)
                          }
                          className="p-2 rounded bg-gray-800 text-white outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeVipPack(idx)}
                          className="p-2 rounded bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block mb-2 text-white/80">Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onImageFilesChange}
                  className="text-white"
                />
                {/* preview existing images if editing */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {/* preview files chosen */}
                  {imageFiles.map((f, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                  {/* existing images from backend (only when editing and user hasn't replaced) */}
                  {currentCompetition?.images?.map((src, idx) => (
                    <img
                      key={`ex-${idx}`}
                      src={`http://localhost:5001${src}`}
                      alt={`img-${idx}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-4 py-2 rounded bg-white/6"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-yellow-400 text-black"
                >
                  <FiSave /> {currentCompetition ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------
          View modal
         ---------------------------- */}
      {isViewOpen && currentCompetition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeAllModals}
          />
          <div className="relative w-full max-w-3xl bg-[#0f1112] border border-white/8 rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {currentCompetition.title}
              </h3>
              <button
                onClick={closeAllModals}
                className="p-2 rounded bg-white/5"
              >
                <FiX />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Slug:</strong> {currentCompetition.slug}
              </p>
              <p>
                <strong>Description:</strong> {currentCompetition.description}
              </p>
              <p>
                <strong>Entry Price:</strong> £{currentCompetition.entryPrice}
              </p>
              <p>
                <strong>Watch Value:</strong> £{currentCompetition.watchValue}
              </p>
              <p>
                <strong>Max Tickets (maxTickets):</strong>{" "}
                {currentCompetition.maxTickets}
              </p>
              <p>
                <strong>Maximum Entries:</strong>{" "}
                {currentCompetition.maximumEntries}
              </p>
              <p>
                <strong>Maximum Winners:</strong>{" "}
                {currentCompetition.maximumWinners}
              </p>
              <p>
                <strong>Sold Tickets:</strong> {currentCompetition.soldTickets}
              </p>
              <p>
                <strong>Draw Date:</strong>{" "}
                {currentCompetition.drawDate
                  ? new Date(currentCompetition.drawDate).toLocaleString()
                  : "—"}
              </p>
              <p>
                <strong>Status:</strong> {currentCompetition.status}
              </p>

              <h4 className="mt-3 font-semibold">Watch Info</h4>
              <p>
                <strong>Brand:</strong> {currentCompetition.brand}
              </p>
              <p>
                <strong>Model:</strong> {currentCompetition.model}
              </p>
              <p>
                <strong>Reference Number:</strong>{" "}
                {currentCompetition.referenceNumber}
              </p>
              <p>
                <strong>Movement:</strong> {currentCompetition.movement}
              </p>
              <p>
                <strong>Year:</strong> {currentCompetition.year}
              </p>
              <p>
                <strong>Caliber:</strong> {currentCompetition.caliber}
              </p>
              <p>
                <strong>Glass:</strong> {currentCompetition.glass}
              </p>
              <p>
                <strong>Bezel Material:</strong>{" "}
                {currentCompetition.bezelMaterial}
              </p>
              <p>
                <strong>Bracelet Material:</strong>{" "}
                {currentCompetition.braceletMaterial}
              </p>
              <p>
                <strong>Papers:</strong> {currentCompetition.papers}
              </p>

              <h4 className="mt-3 font-semibold">VIP Packs</h4>
              {currentCompetition.vipPacks?.length ? (
                currentCompetition.vipPacks.map((p, i) => (
                  <div key={i} className="p-2 bg-gray-900 rounded mb-1">
                    <div>Tickets: {p.tickets}</div>
                    <div>Discount: {p.discount}</div>
                    <div>Chance: {p.chance}</div>
                  </div>
                ))
              ) : (
                <div className="text-white/60">No VIP packs</div>
              )}

              <h4 className="mt-3 font-semibold">Images</h4>
              <div className="flex gap-2 overflow-x-auto">
                {currentCompetition.images?.map((src, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5001${src}`}
                    alt={`img-${i}`}
                    className="h-24 w-auto object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
