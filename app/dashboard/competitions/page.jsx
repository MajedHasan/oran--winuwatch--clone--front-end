"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiPlus,
  FiSearch,
  FiSave,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/**
 * Real-world Super Admin Competitions Page
 * - Add / Edit / View / Delete / Schedule Draw functionality
 * - Fields: name, image, description, ticketPrice (bidPrice), winningPrice, maxTickets, totalEntries, startDate, endDate, status
 * - Search + pagination
 * - Uses simple <img> (not next/image) for straightforward copying
 */

/* ---------------------- Mock data ---------------------- */
const initialCompetitions = [
  {
    id: 1,
    name: "Rolex Submariner Hulk",
    image: "/images/rolex1.jpg",
    description: "Limited-run Submariner with green ceramic bezel.",
    ticketPrice: 25,
    lastBid: 75,
    winningPrice: 20000,
    maxTickets: 500,
    totalEntries: 120,
    startDate: "2025-08-01",
    endDate: "2025-08-25",
    status: "Active",
    drawDate: "",
  },
  {
    id: 2,
    name: "Patek Philippe Nautilus",
    image: "/images/patek1.jpg",
    description: "Classic Nautilus prize — exclusive raffle.",
    ticketPrice: 30,
    lastBid: 125,
    winningPrice: 30000,
    maxTickets: 400,
    totalEntries: 90,
    startDate: "2025-08-10",
    endDate: "2025-09-05",
    status: "Upcoming",
    drawDate: "",
  },
  {
    id: 3,
    name: "Audemars Piguet Royal Oak",
    image: "/images/audemars1.jpg",
    description: "Royal Oak special edition competition.",
    ticketPrice: 20,
    lastBid: 50,
    winningPrice: 25000,
    maxTickets: 350,
    totalEntries: 60,
    startDate: "2025-07-15",
    endDate: "2025-08-10",
    status: "Completed",
    drawDate: "2025-08-10T18:20",
  },
];

/* ---------------------- Helper ---------------------- */
const emptyForm = {
  id: null,
  name: "",
  image: "",
  description: "",
  ticketPrice: 25,
  lastBid: 0,
  winningPrice: 0,
  maxTickets: 100,
  totalEntries: 0,
  startDate: "",
  endDate: "",
  status: "Upcoming",
  drawDate: "",
};

/* ---------------------- Component ---------------------- */
export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState(initialCompetitions);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal state
  const [modal, setModal] = useState({ open: false, type: null, data: null });
  // Form state (used for add / edit)
  const [form, setForm] = useState(emptyForm);

  // Keep pagination in bounds if data changes
  useEffect(() => {
    const pages = Math.max(
      1,
      Math.ceil(filteredCompetitions.length / itemsPerPage)
    );
    if (currentPage > pages) setCurrentPage(pages);
  }, [competitions, search]);

  // Filtered list (by search)
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [competitions, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompetitions.length / itemsPerPage)
  );

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCompetitions.slice(start, start + itemsPerPage);
  }, [filteredCompetitions, currentPage]);

  /* ---------------------- Modal handlers ---------------------- */
  function openModal(type, data = null) {
    setModal({ open: true, type, data });
    if (type === "add") {
      setForm({ ...emptyForm });
    } else if (data) {
      // clone to avoid direct mutation
      setForm({ ...data });
    }
    // ensure scroll position
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeModal() {
    setModal({ open: false, type: null, data: null });
    setForm(emptyForm);
  }

  /* ---------------------- CRUD operations ---------------------- */
  function handleFormChange(e) {
    const { name, value, type } = e.target;
    const parsed =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setForm((s) => ({ ...s, [name]: parsed }));
  }

  function handleAddOrEdit(e) {
    e.preventDefault();
    // Basic validations
    if (!form.name?.trim()) {
      alert("Name is required");
      return;
    }
    if (!form.startDate || !form.endDate) {
      alert("Start and end dates are required");
      return;
    }
    // ensure numeric values
    const newData = {
      ...form,
      ticketPrice: Number(form.ticketPrice) || 0,
      lastBid: Number(form.lastBid) || 0,
      winningPrice: Number(form.winningPrice) || 0,
      maxTickets: Number(form.maxTickets) || 0,
      totalEntries: Number(form.totalEntries) || 0,
    };

    if (modal.type === "add") {
      const newId = Math.max(0, ...competitions.map((c) => c.id)) + 1;
      setCompetitions((prev) => [{ ...newData, id: newId }, ...prev]);
    } else if (modal.type === "edit") {
      setCompetitions((prev) =>
        prev.map((c) => (c.id === newData.id ? newData : c))
      );
    }

    closeModal();
  }

  function confirmDelete(id) {
    if (!confirm("Delete this competition? This action cannot be undone."))
      return;
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
    closeModal();
  }

  function handleScheduleSubmit(e) {
    e.preventDefault();
    if (!form.drawDate) {
      alert("Pick a draw date & time.");
      return;
    }
    setCompetitions((prev) =>
      prev.map((c) =>
        c.id === form.id
          ? { ...c, drawDate: form.drawDate, status: "Scheduled" }
          : c
      )
    );
    closeModal();
  }

  function toggleStatus(id) {
    setCompetitions((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status:
                c.status === "Active"
                  ? "Completed"
                  : c.status === "Completed"
                  ? "Upcoming"
                  : "Active",
            }
          : c
      )
    );
  }

  /* ---------------------- Helpers ---------------------- */
  function statusBadge(status) {
    if (status === "Active") return "bg-emerald-500/20 text-emerald-300";
    if (status === "Upcoming") return "bg-yellow-500/20 text-yellow-300";
    if (status === "Scheduled") return "bg-indigo-500/20 text-indigo-300";
    return "bg-gray-700 text-gray-300";
  }

  /* ---------------------- Render ---------------------- */
  return (
    <div className="p-6 space-y-6">
      {/* Header / Topbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Competitions</h1>
          <p className="text-sm text-white/60 mt-1 max-w-xl">
            Manage competitions — add, edit, schedule draws, view participants
            and track performance.
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="flex items-center bg-white/5 rounded-lg px-3 py-2 w-full md:w-[380px]">
            <FiSearch className="text-white/50 mr-2" />
            <input
              className="bg-transparent outline-none text-white placeholder-white/50 w-full"
              placeholder="Search competitions, prizes, ids..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button
            onClick={() => openModal("add")}
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
          >
            <FiPlus /> Add Competition
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-400/5 p-5 rounded-2xl border border-white/6">
          <div className="text-sm text-white/70">Total Competitions</div>
          <div className="text-2xl font-bold mt-2">{competitions.length}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 p-5 rounded-2xl border border-white/6">
          <div className="text-sm text-white/70">Active</div>
          <div className="text-2xl font-bold mt-2">
            {competitions.filter((c) => c.status === "Active").length}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-400/10 to-indigo-400/5 p-5 rounded-2xl border border-white/6">
          <div className="text-sm text-white/70">Scheduled</div>
          <div className="text-2xl font-bold mt-2">
            {
              competitions.filter(
                (c) => c.status === "Scheduled" || c.status === "Upcoming"
              ).length
            }
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-400/10 to-gray-400/5 p-5 rounded-2xl border border-white/6">
          <div className="text-sm text-white/70">Total Entries</div>
          <div className="text-2xl font-bold mt-2">
            {competitions.reduce((s, c) => s + Number(c.totalEntries || 0), 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f0f10] rounded-2xl border border-white/8 p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/6 text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="px-4 py-3 text-left">Competition</th>
                <th className="px-4 py-3 text-left">Type / Prize</th>
                <th className="px-4 py-3 text-left">Price / Last Bid</th>
                <th className="px-4 py-3 text-left">Entries</th>
                <th className="px-4 py-3 text-left">Max Tickets</th>
                <th className="px-4 py-3 text-left">Duration</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-white/90">
              {paginated.map((c) => (
                <tr key={c.id} className="hover:bg-white/3 transition">
                  {/* competition + thumbnail */}
                  <td className="px-4 py-3 flex items-center gap-3 min-w-[220px]">
                    <img
                      src={c.image || "/images/placeholder.png"}
                      alt={c.name}
                      className="w-16 h-16 object-cover rounded-lg border border-white/6"
                    />
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-white/60 mt-1 max-w-[300px]">
                        {c.description?.slice(0, 80) || "—"}
                      </div>
                    </div>
                  </td>

                  {/* Type / prize */}
                  <td className="px-4 py-3">
                    <div className="text-sm">{c.type || "Lottery"}</div>
                    <div className="text-sm text-white/70 mt-1">
                      Prize: £{c.winningPrice}
                    </div>
                  </td>

                  {/* ticket price / last bid */}
                  <td className="px-4 py-3">
                    <div>Ticket: £{c.ticketPrice}</div>
                    <div className="text-white/60 mt-1">
                      Last bid: £{c.lastBid}
                    </div>
                  </td>

                  {/* entries */}
                  <td className="px-4 py-3">
                    <div className="font-semibold">{c.totalEntries}</div>
                    <div className="text-xs text-white/60 mt-1">
                      (
                      {Math.round(
                        ((c.totalEntries || 0) / (c.maxTickets || 1)) * 100
                      )}
                      %)
                    </div>
                  </td>

                  {/* max tickets */}
                  <td className="px-4 py-3">{c.maxTickets}</td>

                  {/* duration */}
                  <td className="px-4 py-3">
                    <div>{c.startDate}</div>
                    <div className="text-xs text-white/60 mt-1">
                      {c.endDate}
                    </div>
                  </td>

                  {/* status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>

                    {c.drawDate && (
                      <div className="text-xs text-white/60 mt-1">
                        Draw: {new Date(c.drawDate).toLocaleString()}
                      </div>
                    )}
                  </td>

                  {/* actions */}
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => openModal("view", c)}
                      className="p-2 rounded-md bg-white/5 hover:bg-white/10"
                      title="View"
                    >
                      <FiEye />
                    </button>

                    <button
                      onClick={() => openModal("edit", c)}
                      className="p-2 rounded-md bg-white/5 hover:bg-white/10"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => {
                        setForm({ ...c });
                        openModal("schedule", c);
                      }}
                      className="p-2 rounded-md bg-white/5 hover:bg-white/10"
                      title="Schedule Draw"
                    >
                      <FiCalendar />
                    </button>

                    <button
                      onClick={() => {
                        setModal({ open: true, type: "delete", data: c });
                        setForm({ ...c });
                      }}
                      className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>

                    <button
                      onClick={() => toggleStatus(c.id)}
                      className="ml-2 p-2 rounded-md bg-white/5 hover:bg-white/10 text-xs"
                      title="Toggle status"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-white/60"
                  >
                    No competitions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-white/60">
            Showing {(currentPage - 1) * itemsPerPage + 1} -
            {Math.min(currentPage * itemsPerPage, filteredCompetitions.length)}{" "}
            of {filteredCompetitions.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-md bg-white/5 hover:bg-white/10"
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
            <div className="px-3 py-1 rounded-md bg-white/6">{currentPage}</div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-md bg-white/5 hover:bg-white/10"
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------- Modals ---------------------- */}
      {modal.open && modal.type === "view" && modal.data && (
        <ModalShell onClose={closeModal} title={`View — ${modal.data.name}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src={modal.data.image || "/images/placeholder.png"}
                alt=""
                className="w-full h-56 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold">{modal.data.name}</h3>
              <p className="text-sm text-white/70 mt-2">
                {modal.data.description}
              </p>

              <div className="mt-4 space-y-2">
                <div>
                  <strong>Ticket Price:</strong> £{modal.data.ticketPrice}
                </div>
                <div>
                  <strong>Last Bid:</strong> £{modal.data.lastBid}
                </div>
                <div>
                  <strong>Winning Price:</strong> £{modal.data.winningPrice}
                </div>
                <div>
                  <strong>Entries:</strong> {modal.data.totalEntries}
                </div>
                <div>
                  <strong>Max Tickets:</strong> {modal.data.maxTickets}
                </div>
                <div>
                  <strong>Duration:</strong> {modal.data.startDate} →{" "}
                  {modal.data.endDate}
                </div>
                <div>
                  <strong>Status:</strong> {modal.data.status}
                </div>
                {modal.data.drawDate && (
                  <div>
                    <strong>Draw:</strong>{" "}
                    {new Date(modal.data.drawDate).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalShell>
      )}

      {modal.open && (modal.type === "add" || modal.type === "edit") && (
        <ModalShell
          onClose={closeModal}
          title={
            modal.type === "add"
              ? "Add Competition"
              : `Edit — ${form.name || ""}`
          }
        >
          <form onSubmit={handleAddOrEdit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Competition name"
                className="w-full p-3 rounded-lg bg-white/5 outline-none"
                required
              />
              <input
                name="image"
                value={form.image}
                onChange={handleFormChange}
                placeholder="Image URL"
                className="w-full p-3 rounded-lg bg-white/5 outline-none"
              />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Short description"
              className="w-full p-3 rounded-lg bg-white/5 outline-none"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                name="ticketPrice"
                value={form.ticketPrice}
                onChange={handleFormChange}
                type="number"
                step="0.01"
                placeholder="Ticket price (e.g. 25)"
                className="p-3 rounded-lg bg-white/5 outline-none"
              />
              <input
                name="lastBid"
                value={form.lastBid}
                onChange={handleFormChange}
                type="number"
                step="0.01"
                placeholder="Last bid (auto updated in real app)"
                className="p-3 rounded-lg bg-white/5 outline-none"
              />
              <input
                name="winningPrice"
                value={form.winningPrice}
                onChange={handleFormChange}
                type="number"
                step="0.01"
                placeholder="Winning price (e.g. 20000)"
                className="p-3 rounded-lg bg-white/5 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                name="maxTickets"
                value={form.maxTickets}
                onChange={handleFormChange}
                type="number"
                placeholder="Max tickets"
                className="p-3 rounded-lg bg-white/5 outline-none"
              />
              <input
                name="totalEntries"
                value={form.totalEntries}
                onChange={handleFormChange}
                type="number"
                placeholder="Total entries"
                className="p-3 rounded-lg bg-white/5 outline-none"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="p-3 rounded-lg bg-white/5 outline-none"
              >
                <option>Upcoming</option>
                <option>Scheduled</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="startDate"
                value={form.startDate}
                onChange={handleFormChange}
                type="date"
                className="p-3 rounded-lg bg-white/5 outline-none"
              />
              <input
                name="endDate"
                value={form.endDate}
                onChange={handleFormChange}
                type="date"
                className="p-3 rounded-lg bg-white/5 outline-none"
              />
            </div>

            {/* image preview */}
            {form.image && (
              <div className="mt-1">
                <div className="text-xs text-white/60 mb-1">Image preview</div>
                <img
                  src={form.image}
                  alt="preview"
                  className="w-full max-h-44 object-cover rounded-lg border border-white/6"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-white/6"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold"
              >
                <FiSave /> {modal.type === "add" ? "Create" : "Save"}
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {modal.open && modal.type === "schedule" && (
        <ModalShell
          onClose={closeModal}
          title={`Schedule Draw — ${form.name || modal.data?.name || ""}`}
        >
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-white/70">Draw Date & Time</label>
              <input
                type="datetime-local"
                name="drawDate"
                value={form.drawDate || ""}
                onChange={handleFormChange}
                className="w-full p-3 rounded-lg bg-white/5 outline-none mt-2"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-white/6"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold"
              >
                Schedule
              </button>
            </div>
          </form>
        </ModalShell>
      )}

      {modal.open && modal.type === "delete" && (
        <ModalShell onClose={closeModal} title="Confirm Delete">
          <div className="space-y-4 text-white/90">
            <p>
              Are you sure you want to permanently delete{" "}
              <strong>{form.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-white/6"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(form.id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

/* ---------------------- Small Modal Shell ---------------------- */
function ModalShell({ children, onClose, title }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-[#0f1112] border border-white/8 rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md bg-white/5 hover:bg-white/10"
          >
            <FiX />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
