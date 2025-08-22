"use client";

import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import api from "@/lib/axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null); // { error: boolean, message: string }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ error: true, message: "Please fill in all fields." });
      return;
    }
    if (!validateEmail(formData.email)) {
      setStatus({
        error: true,
        message: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Post to your existing backend route (/api/contact)
      const res = await api.post("/contact", formData, { headers });

      // adapt to response shape (assume success status 201 or 200)
      if (res && (res.status === 200 || res.status === 201)) {
        setStatus({
          error: false,
          message: "Thanks for reaching out! We'll reply soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus({
          error: true,
          message:
            (res && res.data && (res.data.error || res.data.message)) ||
            "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      // prefer error message from server if available
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Network error. Please try again later.";
      setStatus({ error: true, message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen bg-gradient-to-b from-[#121212] via-[#1e1e1e] to-[#121212] py-16 px-6 md:px-20 flex items-center"
      style={{ scrollMarginTop: "5rem" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="text-white space-y-8 max-w-lg">
          <h1 className="text-5xl font-extrabold text-[#d4af37] leading-tight tracking-wide">
            Get in Touch
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Whether you have questions, feedback, or want to join the next
            competition, we’re here to help. Reach out to us using the form or
            through our contact details below.
          </p>

          <div className="space-y-6">
            <ContactInfoItem
              icon={<FiMapPin size={30} className="text-[#d4af37]" />}
              title="Address"
              description="123 Luxury St, Watch City, UK"
            />
            <ContactInfoItem
              icon={<FiPhone size={30} className="text-[#d4af37]" />}
              title="Phone"
              description="+44 123 456 7890"
            />
            <ContactInfoItem
              icon={<FiMail size={30} className="text-[#d4af37]" />}
              title="Email"
              description="contact@winuwatch.com"
            />
          </div>

          <blockquote className="mt-12 italic text-gray-400 border-l-4 border-[#d4af37] pl-6">
            “A great watch is the only piece of jewelry a man should wear.”
          </blockquote>
        </div>

        {/* Right Content - Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1f1f1f] p-10 rounded-3xl shadow-2xl border border-[#d4af37] max-w-md w-full mx-auto"
          noValidate
        >
          <h2 className="text-3xl font-bold text-[#d4af37] mb-10 text-center">
            Send Us a Message
          </h2>

          <FloatingInput
            id="name"
            name="name"
            label="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FloatingInput
            id="email"
            name="email"
            label="Your Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FloatingTextarea
            id="message"
            name="message"
            label="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          {status && (
            <p
              className={`mt-4 text-center text-sm ${
                status.error ? "text-red-500" : "text-green-500"
              }`}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-10 w-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] py-4 rounded-xl font-bold text-black text-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-60"
            aria-busy={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

// Floating Input Component
function FloatingInput({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  required,
}) {
  return (
    <div className="relative z-0 w-full mb-8">
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        autoComplete="off"
        className="peer block w-full appearance-none border-b-2 border-gray-600 bg-transparent py-3 px-0 text-white focus:border-[#d4af37] focus:outline-none focus:ring-0"
      />
      <label
        htmlFor={id}
        className="absolute top-3 -z-10 origin-[0] scale-100 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-[#d4af37] peer-focus:font-semibold"
      >
        {label}
      </label>
    </div>
  );
}

// Floating Textarea Component
function FloatingTextarea({ id, name, label, value, onChange, required }) {
  return (
    <div className="relative z-0 w-full mb-8">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={5}
        placeholder=" "
        className="peer block w-full appearance-none border-b-2 border-gray-600 bg-transparent py-3 px-0 text-white resize-none focus:border-[#d4af37] focus:outline-none focus:ring-0"
      ></textarea>
      <label
        htmlFor={id}
        className="absolute top-3 -z-10 origin-[0] scale-100 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-[#d4af37] peer-focus:font-semibold"
      >
        {label}
      </label>
    </div>
  );
}

// Contact info item component
function ContactInfoItem({ icon, title, description }) {
  return (
    <div className="flex items-center gap-5">
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <h4 className="text-white font-semibold text-lg">{title}</h4>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}
