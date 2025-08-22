"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios"; // your axios instance

export default function RegisterPage() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      fullName == "" ||
      email == "" ||
      password == "" ||
      confirmPassword == ""
    ) {
      setError("All field are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      const { user, token } = res.data;

      // Save user data locally
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect by role
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/users");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#121212] via-[#1f1f1f] to-[#2c2c2c] px-6">
      <div className="w-full max-w-md bg-[#1f1f1f] rounded-3xl shadow-2xl p-10 relative overflow-hidden">
        <h1 className="text-4xl font-extrabold text-[#d4af37] mb-10 text-center drop-shadow-lg">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit} noValidate className="animate-fadeIn">
          <FloatingInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onFocus={() => setFocusedInput("fullName")}
            onBlur={() => setFocusedInput(null)}
            focused={focusedInput === "fullName"}
            type="text"
          />
          <FloatingInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput(null)}
            focused={focusedInput === "email"}
            type="email"
          />
          <FloatingInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
            focused={focusedInput === "password"}
            type="password"
          />
          <FloatingInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={() => setFocusedInput("confirmPassword")}
            onBlur={() => setFocusedInput(null)}
            focused={focusedInput === "confirmPassword"}
            type="password"
          />

          {error && (
            <p className="mt-2 text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-8 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-yellow-400 text-black font-extrabold text-lg shadow-lg transition-transform duration-300 ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-2xl"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#d4af37] hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

function FloatingInput({
  label,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
  type = "text",
}) {
  return (
    <div className="relative w-full my-6">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="peer placeholder-transparent w-full border-b border-gray-600 bg-transparent py-3 text-white text-lg focus:outline-none focus:border-yellow-400 transition"
        placeholder={label}
        autoComplete="off"
        required
      />
      <label
        htmlFor={name}
        className={`absolute left-0 top-3 text-gray-400 text-md transition-all duration-300
          peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500
          ${
            focused || value ? "top-0 text-[#d4af37] text-sm font-semibold" : ""
          }
        `}
      >
        {label}
      </label>
    </div>
  );
}
