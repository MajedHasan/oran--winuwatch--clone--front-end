"use client";

import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import api from "@/lib/axios";

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ category: "", question: "", answer: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/faqs", { headers });
      setFaqs(data);
    } catch (error) {
      console.error(
        "Error fetching FAQs:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.category || !form.question || !form.answer) return;

      if (editingId) {
        await api.put(`/faqs/${editingId}`, form, { headers });
        alert("FAQ updated successfully");
      } else {
        await api.post("/faqs", form, { headers });
        alert("FAQ added successfully");
      }

      setForm({ category: "", question: "", answer: "" });
      setEditingId(null);
      fetchFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save FAQ");
    }
  };

  const handleEdit = (faq) => {
    setForm({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
    });
    setEditingId(faq._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await api.delete(`/faqs/${id}`, { headers });
      alert("FAQ deleted successfully");
      fetchFAQs();
    } catch (error) {
      console.error(
        "Error deleting FAQ:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to delete FAQ");
    }
  };

  return (
    <div className="p-10 min-h-screen bg-[#121212] text-white">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">Manage FAQs</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-[#1f1f1f] p-6 rounded-3xl shadow-lg space-y-4"
      >
        <input
          type="text"
          placeholder="Category"
          className="w-full p-3 rounded-xl bg-[#121212]"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Question"
          className="w-full p-3 rounded-xl bg-[#121212]"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
        />
        <textarea
          placeholder="Answer"
          className="w-full p-3 rounded-xl bg-[#121212]"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <FiPlus /> {editingId ? "Update FAQ" : "Add FAQ"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400">Loading FAQs...</p>
      ) : (
        <div className="space-y-4">
          {faqs.length === 0 ? (
            <p className="text-gray-400">No FAQs found</p>
          ) : (
            faqs.map((faq) => (
              <div
                key={faq._id}
                className="bg-[#1f1f1f] p-4 rounded-xl flex justify-between items-center shadow hover:shadow-lg"
              >
                <div>
                  <p className="font-semibold text-yellow-400">
                    {faq.category}
                  </p>
                  <p className="text-gray-300">{faq.question}</p>
                  <p className="text-gray-400 text-sm">{faq.answer}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg flex items-center gap-1"
                    onClick={() => handleEdit(faq)}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg flex items-center gap-1"
                    onClick={() => handleDelete(faq._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
