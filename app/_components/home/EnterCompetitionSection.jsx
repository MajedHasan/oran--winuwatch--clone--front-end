"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    title: "#1 ROLEX BRUCE WAYNE",
    image: "/images/watch1.webp",
    drawDate: "2025-08-22T23:59:59",
    watch: "ROLEX BRUCE WAYNE",
    watchValue: "£20k",
    entryPrice: "£15",
    maxTickets: "2000",
  },
  {
    title: "#2 ROLEX EVEROSE-GOLD 18 Karat",
    image: "/images/watch2.webp",
    drawDate: "2025-09-01T23:59:59",
    watch: "ROLEX EVEROSE-GOLD 18 Karat",
    watchValue: "£38k",
    entryPrice: "£25",
    maxTickets: "1500",
  },
];

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const total = Date.parse(targetDate) - Date.now();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 text-center text-xl font-semibold">
      <div>
        <p>{timeLeft.days}</p>
        <span className="text-sm text-gray-500">DAY</span>
      </div>
      <div>
        <p>{timeLeft.hours}</p>
        <span className="text-sm text-gray-500">HOUR</span>
      </div>
      <div>
        <p>{timeLeft.minutes}</p>
        <span className="text-sm text-gray-500">MIN</span>
      </div>
      <div>
        <p>{timeLeft.seconds}</p>
        <span className="text-sm text-gray-500">SEC</span>
      </div>
    </div>
  );
}

export default function EnterCompetitionSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-16 px-4 md:px-12 lg:px-24 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
        Enter the competition
      </h2>

      <div className="flex justify-center gap-6 mb-6">
        {slides.map((s, idx) => (
          <span
            key={idx}
            className={`text-sm md:text-base font-semibold transition-all ${
              idx === activeSlide
                ? "text-black underline underline-offset-4"
                : "text-gray-400"
            }`}
          >
            {s.title}
          </span>
        ))}
      </div>

      {/* Slider */}
      <div className="relative overflow-hidden max-w-6xl mx-auto">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="min-w-full flex flex-col lg:flex-row items-center gap-8 bg-gray-100 rounded-xl p-6 shadow-lg"
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={slide.image}
                  alt={slide.watch}
                  width={500}
                  height={400}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Info */}
              <div className="w-full lg:w-1/2 space-y-4">
                <Countdown targetDate={slide.drawDate} />

                <p className="text-lg font-medium">
                  <strong>MAXIMUM TICKETS:</strong> {slide.maxTickets}
                </p>

                <p className="text-lg font-medium">
                  <strong>Watch Value:</strong> {slide.watchValue}
                </p>

                <p className="text-lg font-medium">
                  <strong>Entry Price:</strong> {slide.entryPrice}
                </p>

                <p className="text-lg font-medium">
                  <strong>Draw Date:</strong>{" "}
                  {new Date(slide.drawDate).toLocaleDateString()}
                </p>

                <button className="mt-4 bg-black text-white py-2 px-6 rounded-xl text-lg hover:bg-gray-800 transition">
                  Join the next competition
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition z-10"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition z-10"
        >
          <ArrowRight />
        </button>
      </div>
    </section>
  );
}
