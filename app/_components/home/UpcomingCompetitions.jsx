"use client";
import Image from "next/image";
import { useState } from "react";

const upcoming = [
  {
    title: "PATEK PHILIPPE AQUANAUT 5167A Model Example",
    value: "£50k",
    image: "/images/watch1.webp",
  },
  {
    title: "AUDEMARS PIGUET ROYAL OAK OFFSHORE",
    value: "£60k",
    image: "/images/watch2.webp",
  },
  {
    title: "ROLEX DAYTONA RAINBOW GOLD",
    value: "£85k",
    image: "/images/watch1.webp",
  },
  {
    title: "RICHARD MILLE RM 011",
    value: "£250k",
    image: "/images/watch2.webp",
  },
  {
    title: "VACHERON CONSTANTIN OVERSEAS",
    value: "£42k",
    image: "/images/watch1.webp",
  },
  {
    title: "OMEGA SPEEDMASTER MOONWATCH",
    value: "£8k",
    image: "/images/watch2.webp",
  },
];

export default function UpcomingCompetitionsSection() {
  return (
    <section className="bg-[#0D0D0D] py-20 px-4 md:px-8 lg:px-20">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-white text-3xl md:text-4xl font-semibold mb-10 text-center">
          Upcoming Competitions
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((item, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="overflow-hidden h-72">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Hover Button */}
              <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
                <button className="mb-20 px-4 py-2 bg-white text-black font-semibold rounded-md text-sm shadow-md hover:bg-gray-200 transition">
                  Get Early Access
                </button>
              </div>

              {/* Text */}
              <div className="p-4 text-center border-t border-gray-800">
                <h3 className="text-white text-sm font-medium leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Value:{" "}
                  <span className="text-white font-semibold">{item.value}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
