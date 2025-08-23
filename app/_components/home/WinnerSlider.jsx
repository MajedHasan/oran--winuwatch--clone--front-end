"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import api from "@/lib/axios";

export default function WinnerSlider() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchWinners() {
      try {
        const res = await api.get("/winners"); // 👈 adjust endpoint to your backend
        setWinners(res.data || []);
      } catch (err) {
        console.error("Failed to fetch winners:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWinners();
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    spacing: 15,
    slides: {
      perView: 4,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    breakpoints: {
      "(max-width: 639px)": {
        slides: { perView: 1 },
      },
      "(min-width: 640px) and (max-width: 1023px)": {
        slides: { perView: 2 },
      },
      "(min-width: 1024px) and (max-width: 1279px)": {
        slides: { perView: 3 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 4 },
      },
    },
  });

  return (
    <section className="bg-[#0b0b0b] py-20 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-400">Loading winners...</p>
        ) : winners.length === 0 ? (
          <p className="text-center text-gray-400">No winners yet.</p>
        ) : (
          <div ref={sliderRef} className="keen-slider -mx-2">
            {winners.map((winner, idx) => (
              <div
                key={winner.id || idx}
                className="keen-slider__slide relative rounded-xl overflow-hidden border border-[#d4af37]/30 shadow-lg h-[480px] group mx-2"
              >
                <Image
                  src={`http://localhost:5001${winner.profileImage}`} // 👈 should be full URL from backend
                  alt={winner.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={idx < 2}
                  unoptimized // 👈 so localhost/backend images don’t break
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-xs uppercase text-[#ffd700] tracking-widest mb-1">
                    Winner of
                  </p>
                  <h3 className="text-lg font-semibold text-white leading-snug">
                    {winner.competition}
                  </h3>
                  <p className="mt-1 text-base font-medium text-white">
                    {winner.name}
                  </p>
                  <p className="text-sm text-[#ffd700]">
                    {winner.prize} <span className="text-white">Value</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="p-3 rounded-full border border-[#d4af37] hover:bg-[#d4af37] hover:text-black disabled:opacity-30 transition"
            aria-label="Previous slide"
          >
            <FiArrowLeft size={20} />
          </button>

          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black font-bold text-lg shadow-lg hover:scale-105 transition">
            View All Winners
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            disabled={
              instanceRef.current &&
              currentSlide >=
                instanceRef.current.track.details.slides.length -
                  instanceRef.current.track.details.slidesPerView
            }
            className="p-3 rounded-full border border-[#d4af37] hover:bg-[#d4af37] hover:text-black disabled:opacity-30 transition"
            aria-label="Next slide"
          >
            <FiArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
