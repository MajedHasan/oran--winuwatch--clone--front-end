"use client";

import React, { useEffect, useState } from "react";
import {
  FiClock,
  FiShield,
  FiUsers,
  FiStar,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";

const statsData = [
  { label: "Competitions Held", value: 42, icon: <FiAward size={40} /> },
  { label: "Watches Awarded", value: 128, icon: <FiStar size={40} /> },
  { label: "Global Partners", value: 260, icon: <FiUsers size={40} /> },
  { label: "Years Experience", value: 7, icon: <FiClock size={40} /> },
];

// Simple count up hook for stats
function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 30);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

export default function AboutUs() {
  return (
    <section className="relative bg-gradient-to-b from-[#121212] via-[#1c1c1c] to-[#121212] text-white min-h-screen overflow-x-hidden">
      {/* Hero with background image */}
      <div
        className="relative h-[600px] flex flex-col justify-center items-center text-center px-6 md:px-20"
        style={{
          backgroundImage: "url('/images/hero-watch-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <h1 className="relative text-6xl md:text-7xl font-extrabold text-[#d4af37] leading-tight max-w-4xl z-10 drop-shadow-lg">
          Our Story & Passion for Timepieces
        </h1>
        <p className="relative mt-6 text-lg md:text-xl text-gray-300 max-w-3xl z-10">
          Win U Watch connects passionate watch lovers worldwide with exclusive
          competitions and rare luxury timepieces. Every tick is a story — and
          your journey starts here.
        </p>
      </div>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 py-20 flex flex-wrap justify-center gap-10">
        {statsData.map(({ label, value, icon }, idx) => {
          const count = useCountUp(value);
          return (
            <div
              key={idx}
              className="flex flex-col items-center bg-[#1f1f1f] rounded-2xl p-10 w-48 text-center shadow-lg hover:shadow-2xl transition-shadow cursor-default"
            >
              <div className="text-[#d4af37] mb-4">{icon}</div>
              <p className="text-5xl font-bold text-[#d4af37]">{count}</p>
              <p className="text-gray-400 mt-2 uppercase tracking-widest">
                {label}
              </p>
            </div>
          );
        })}
      </section>

      {/* Timeline / Our Journey with subtle pattern bg */}
      <section
        className="relative max-w-6xl mx-auto px-6 md:px-0 py-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(212,175,55,0.05) 1px, transparent 2px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="border-l-2 border-[#d4af37] absolute h-full top-0 left-12 hidden md:block"></div>

        {[
          // Timeline items
          {
            year: "2018",
            title: "Founded with a Vision",
            description:
              "Started as a small idea to democratize luxury watch ownership through innovative competitions.",
          },
          {
            year: "2020",
            title: "First Million-Pound Giveaway",
            description:
              "Hosted our first major competition, awarding a stunning £50k Patek Philippe Aquanaut.",
          },
          {
            year: "2023",
            title: "260+ Global Partners",
            description:
              "Expanded our network to over 260 trusted luxury watch dealers worldwide.",
          },
          {
            year: "2025",
            title: "Future Vision",
            description:
              "Committed to blending tradition with technology, ensuring every enthusiast’s dream comes true.",
          },
        ].map(({ year, title, description }, idx) => (
          <div
            key={year}
            className="relative mb-16 flex flex-col md:flex-row md:items-center md:ml-24"
          >
            <div className="flex-shrink-0 md:w-24 md:text-right text-[#d4af37] font-bold text-lg select-none">
              {year}
            </div>
            <div className="bg-[#1f1f1f] rounded-2xl p-8 md:ml-10 shadow-xl flex-1 transition-transform hover:-translate-y-2 duration-300 cursor-default">
              <h3 className="text-3xl font-semibold mb-3">{title}</h3>
              <p className="text-gray-300 text-lg">{description}</p>
            </div>
            <div className="hidden md:block absolute top-8 left-8 w-6 h-6 rounded-full bg-[#d4af37] border-4 border-[#121212]" />
          </div>
        ))}
      </section>

      {/* Core Values with shimmer */}
      <section className="mb-32 max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
        {[
          {
            icon: (
              <FiStar
                size={50}
                className="mx-auto mb-5 text-[#d4af37] drop-shadow-lg"
              />
            ),
            title: "Exclusivity",
            desc: "Access rare and coveted timepieces only available to our community.",
          },
          {
            icon: (
              <FiShield
                size={50}
                className="mx-auto mb-5 text-[#d4af37] drop-shadow-lg"
              />
            ),
            title: "Trust & Security",
            desc: "Transparent competitions backed by secure third-party verification.",
          },
          {
            icon: (
              <FiUsers
                size={50}
                className="mx-auto mb-5 text-[#d4af37] drop-shadow-lg"
              />
            ),
            title: "Community",
            desc: "A passionate network of collectors, enthusiasts, and watch lovers.",
          },
          {
            icon: (
              <FiClock
                size={50}
                className="mx-auto mb-5 text-[#d4af37] drop-shadow-lg"
              />
            ),
            title: "Legacy",
            desc: "Celebrating the heritage and craftsmanship of iconic watchmakers.",
          },
        ].map(({ icon, title, desc }, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-tr from-[#2e2e2e] to-[#1b1b1b] rounded-3xl p-10 shadow-2xl hover:shadow-[0_0_20px_#d4af37] transition-shadow cursor-default"
          >
            {icon}
            <h4 className="text-2xl font-semibold mb-3">{title}</h4>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials slider placeholder */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 mb-32">
        <h2 className="text-4xl text-center font-extrabold text-[#d4af37] mb-14">
          What Our Winners Say
        </h2>

        {/* Replace below div with a real slider */}
        <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
          {[
            {
              name: "Emily Wright",
              img: "/images/team/emily.webp",
              quote:
                "Winning my first competition changed my life! The whole experience was so seamless and exciting.",
              title: "Luxury Collector",
            },
            {
              name: "John Smith",
              img: "/images/team/john.webp",
              quote:
                "Trustworthy and fun platform. I recommend Win U Watch to every watch enthusiast I know.",
              title: "Watch Enthusiast",
            },
            {
              name: "Sophia Khan",
              img: "/images/team/sophia.webp",
              quote:
                "The team is super professional and the prizes are out of this world. I’m already looking forward to the next draw!",
              title: "Global Partner",
            },
          ].map(({ name, img, quote, title }, idx) => (
            <div
              key={idx}
              className="max-w-sm bg-[#1f1f1f] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow cursor-default"
            >
              <div className="flex items-center mb-6 space-x-4">
                <img
                  src={img}
                  alt={name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37]"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-lg">{name}</p>
                  <p className="text-[#d4af37] uppercase tracking-wide text-xs">
                    {title}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 italic leading-relaxed">"{quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Media / Press logos */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 mb-24">
        <h2 className="text-center text-3xl text-gray-400 uppercase tracking-widest mb-12">
          As Featured In
        </h2>
        <div className="flex justify-center flex-wrap gap-16 items-center">
          {[
            "/images/press1.png",
            "/images/press2.png",
            "/images/press3.png",
            "/images/press4.png",
          ].map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt="Press logo"
              className="max-h-14 opacity-70 hover:opacity-100 transition-opacity cursor-default"
              loading="lazy"
            />
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 mb-24">
        <h2 className="text-4xl font-extrabold text-[#d4af37] mb-12 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              name: "Majed Hasan",
              role: "Founder & CEO",
              img: "/images/team/majed.webp",
              desc: "A visionary entrepreneur passionate about watches and innovation.",
            },
            {
              name: "Sophia Khan",
              role: "Head of Partnerships",
              img: "/images/team/sophia.webp",
              desc: "Connecting with global partners to bring you exclusive prizes.",
            },
            {
              name: "Liam Chen",
              role: "Chief Technology Officer",
              img: "/images/team/liam.webp",
              desc: "Crafting seamless user experiences and secure platforms.",
            },
          ].map(({ name, role, img, desc }, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-tr from-[#2e2e2e] to-[#1b1b1b] rounded-3xl shadow-2xl overflow-hidden group cursor-default"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={img}
                  alt={name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-semibold mb-1">{name}</h3>
                <p className="text-sm uppercase text-[#d4af37] tracking-wide mb-4">
                  {role}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <footer className="py-20 bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black text-center">
        <p className="text-2xl md:text-3xl font-extrabold mb-8 max-w-3xl mx-auto">
          Ready to join a community that truly values time and craftsmanship?
        </p>
        <button className="bg-black px-14 py-5 rounded-full font-bold text-[#d4af37] text-xl shadow-lg hover:scale-105 transition-transform cursor-pointer">
          Join the Next Competition
        </button>
      </footer>
    </section>
  );
}
