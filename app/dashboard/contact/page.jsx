"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchContacts = async () => {
    try {
      const res = await api.get("/contact", { headers });
      setContacts(res.data);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await api.delete(`/contact/${id}`, { headers });
      fetchContacts();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
      <table className="min-w-full bg-gray-900 text-white rounded-xl overflow-hidden">
        <thead className="bg-[#d4af37] text-black">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Message</th>
            <th className="p-3">Date</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c._id} className="border-b border-gray-700">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.email}</td>
              <td className="p-3">{c.message}</td>
              <td className="p-3">{new Date(c.createdAt).toLocaleString()}</td>
              <td className="p-3">
                <button
                  onClick={() => deleteContact(c._id)}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
