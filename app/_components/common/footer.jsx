"use client";

import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { ShieldCheck, Star, Globe, Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] text-gray-300 py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand + Tagline */}
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-[#d4af37]">
            Win U Watch
          </h2>
          <p className="text-gray-400 leading-relaxed max-w-xs">
            The ultimate destination to win luxury watches and join elite
            competitions.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full bg-gray-800 hover:bg-[#d4af37] hover:text-black transition-colors duration-300"
                  aria-label="Social link"
                >
                  <Icon size={20} />
                </a>
              )
            )}
          </div>
        </div>

        {/* Quick Links */}
        <nav className="grid grid-cols-2 gap-6 md:grid-cols-1">
          <div>
            <h3 className="text-white font-semibold mb-4">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-[#d4af37] transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4af37] transition">
                  Competitions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4af37] transition">
                  Winners
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#d4af37] transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Minimal Why Choose Us with Icons */}
        <div>
          <h3 className="text-white font-semibold mb-4">Why Choose Us?</h3>
          <ul className="space-y-6 text-sm text-gray-400">
            <li className="flex items-center gap-3">
              <ShieldCheck className="text-[#d4af37]" size={20} />
              <span>Secure & Fair Draws</span>
            </li>
            <li className="flex items-center gap-3">
              <Star className="text-[#d4af37]" size={20} />
              <span>Premium Watches</span>
            </li>
            <li className="flex items-center gap-3">
              <Globe className="text-[#d4af37]" size={20} />
              <span>Global Partners</span>
            </li>
            <li className="flex items-center gap-3">
              <Users className="text-[#d4af37]" size={20} />
              <span>Passionate Community</span>
            </li>
          </ul>
        </div>

        {/* Brand Slogan + Developer Credit */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold mb-4">Experience Luxury</h3>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              Experience the thrill of winning and the joy of owning your dream
              luxury timepiece.
            </p>
          </div>
          <div className="mt-10 text-gray-500 text-xs select-none">
            © {new Date().getFullYear()} Win U Watch. All rights reserved.
            <br />
            Developed by{" "}
            <a
              href="https://madconsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4af37] hover:underline"
            >
              Madcon Solution
            </a>
            .
          </div>
        </div>
      </div>
    </footer>
  );
}
