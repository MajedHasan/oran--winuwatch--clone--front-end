// app/_components/home/WinSection.jsx

"use client";

import React from "react";

const WinSection = () => {
  return (
    <section className="bg-[#0d0d0d] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* LEFT */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-[#d4af37]">
            WinUWatch is a game of skill and knowledge
          </h2>
          <p className="text-lg font-semibold text-white tracking-wide">
            <span className="block text-gray-400">OUR GOAL IS</span>
            <span className="block text-4xl font-extrabold text-[#ffd700] mt-2">
              for everyone
            </span>
            <span className="block text-5xl font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mt-2">
              TO WIN
            </span>
            <span className="block text-2xl text-[#d4af37] mt-2 tracking-widest">
              THE WATCH OF THEIR DREAMS.
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-gradient-to-br from-[#d4af37]/10 via-[#111] to-[#000] border border-[#d4af37]/40 rounded-2xl p-8 shadow-xl text-center space-y-4">
          <p className="text-sm uppercase text-[#ffd700] tracking-widest">
            We've Given Away
          </p>
          <h3 className="text-4xl sm:text-5xl font-extrabold text-[#d4af37] tracking-tight drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">
            £4,126,540
          </h3>
          <p className="text-lg font-medium text-gray-300">
            Worth of luxury watches.
          </p>
          <p className="text-base font-semibold text-white mt-2">
            🌍 Top-Ranked Globally for <br />
            <span className="text-[#ffd700]">Unbeatable Winning Chances</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WinSection;
