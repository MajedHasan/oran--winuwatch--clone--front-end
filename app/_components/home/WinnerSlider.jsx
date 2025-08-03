"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const winners = [
  {
    image: "/images/winner1.webp",
    name: "Raphael Brami",
    prize: "WHITE GOLD DAYTONA GHOST",
    value: "£32k",
  },
  {
    image: "/images/winner2.webp",
    name: "Sophia Khan",
    prize: "Royal Oak 15500ST",
    value: "£24k",
  },
  {
    image: "/images/winner3.webp",
    name: "Liam Chen",
    prize: "Patek Philippe Nautilus",
    value: "£68k",
  },
  {
    image: "/images/winner4.webp",
    name: "Emily Wright",
    prize: "Rolex Submariner Hulk",
    value: "£18k",
  },
  {
    image: "/images/winner5.webp",
    name: "John Smith",
    prize: "Omega Seamaster",
    value: "£14k",
  },
];

export default function WinnerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
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
        slides: {
          perView: 1,
        },
      },
      "(min-width: 640px) and (max-width: 1023px)": {
        slides: {
          perView: 2,
        },
      },
      "(min-width: 1024px) and (max-width: 1279px)": {
        slides: {
          perView: 3,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 4,
        },
      },
    },
  });

  return (
    <section className="bg-[#0b0b0b] py-20 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <div ref={sliderRef} className="keen-slider -mx-2">
          {winners.map((winner, idx) => (
            <div
              key={idx}
              className="keen-slider__slide relative rounded-xl overflow-hidden border border-[#d4af37]/30 shadow-lg h-[480px] group mx-2"
            >
              <Image
                src={winner.image}
                alt={winner.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={idx < 2}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-xs uppercase text-[#ffd700] tracking-widest mb-1">
                  Winner of
                </p>
                <h3 className="text-lg font-semibold text-white leading-snug">
                  {winner.prize}
                </h3>
                <p className="mt-1 text-base font-medium text-white">
                  {winner.name}
                </p>
                <p className="text-sm text-[#ffd700]">
                  {winner.value} <span className="text-white">Value</span>
                </p>
              </div>
            </div>
          ))}
        </div>

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
