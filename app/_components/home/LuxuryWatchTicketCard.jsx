"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function LuxuryWatchTicketCard({
  imageSrc = "/images/watch1.webp",
  title = "Rolex Daytona",
  subtitle = "Enter for a chance to win this luxury timepiece",
  totalTickets = 300,
  remainingTickets = 120,
  watchValue = "$12,500",
  ticketPrice = "$20",
  countdownEnd = Date.now() + 6 * 60 * 60 * 1000, // 6 hours from now
}) {
  const [countdownEndTime] = useState(() => Date.now() + 6 * 60 * 60 * 1000); // fix here

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(countdownEnd));
  const cardRef = useRef();

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(countdownEnd));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdownEnd]);

  // Tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const reset = () => {
      card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", reset);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", reset);
    };
  }, []);

  const isSoldOut = remainingTickets <= 0;

  return (
    <>
      <div
        ref={cardRef}
        className="w-full lg:w-1/2 bg-[#111111] rounded-2xl shadow-2xl border border-[#d4af37] overflow-hidden transition-transform duration-300 text-white font-sans"
      >
        {/* Image */}
        <div className="relative h-[500px] w-full overflow-hidden rounded-t-2xl">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-extrabold text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.9)]">
              {title}
            </h1>
            <p className="text-sm text-gray-300">{subtitle}</p>
          </div>

          {/* Countdown + Ticket Price + Watch Value */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <CountdownDisplay timeLeft={timeLeft} />
            <div className="text-center md:text-right space-y-2">
              <div>
                <p className="text-sm text-gray-300 font-medium">
                  Ticket Price
                </p>
                <p className="text-xl font-bold text-[#ffd700]">
                  {ticketPrice}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300 font-medium">Watch Value</p>
                <p className="text-xl font-bold text-[#d4af37]">{watchValue}</p>
              </div>
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto text-center sm:text-left">
              <p className="text-sm text-gray-300 font-medium">
                Tickets Remaining
              </p>
              <p className="text-base text-white">
                {remainingTickets} / {totalTickets}
              </p>
              <div className="w-full h-2 bg-[#222] rounded-full mt-1">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] transition-all duration-500"
                  style={{
                    width: `${(remainingTickets / totalTickets) * 100}%`,
                  }}
                />
              </div>
            </div>
            <GetTicketButton disabled={isSoldOut} />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        .countdown-digit {
          text-shadow: 0 0 6px #d4af37, 0 0 15px #d4af37;
          animation: glowPulse 2.5s ease-in-out infinite alternate;
        }

        @keyframes glowPulse {
          0% {
            text-shadow: 0 0 4px #d4af37;
            color: #fff8dc;
          }
          100% {
            text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
            color: #fffbe6;
          }
        }

        .btn-shine::before {
          content: "";
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.15) 100%
          );
          transform: skewX(-20deg);
          transition: all 0.7s ease;
        }

        .btn-shine:hover::before {
          left: 150%;
        }
      `}</style>
    </>
  );
}

// Countdown timer
function CountdownDisplay({ timeLeft }) {
  const [hours, minutes, seconds] = timeLeft;
  return (
    <div className="flex justify-center space-x-4 bg-[#1a1a1a] rounded-xl px-4 py-3 border border-[#d4af37]/70 shadow-md w-full md:w-auto">
      <CountdownBox label="Hrs" value={hours} />
      <CountdownBox label="Min" value={minutes} />
      <CountdownBox label="Sec" value={seconds} />
    </div>
  );
}

function CountdownBox({ label, value }) {
  return (
    <div className="countdown-digit font-mono text-4xl font-bold text-center w-14">
      {value}
      <span className="block text-xs text-gray-400 mt-1">{label}</span>
    </div>
  );
}

// Button
function GetTicketButton({ disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`relative w-full sm:w-auto px-6 py-3 rounded-xl text-black font-extrabold text-lg tracking-wide shadow-lg overflow-hidden btn-shine transition hover:cursor-pointer ${
        disabled
          ? "bg-gray-500 cursor-not-allowed text-white"
          : "bg-gradient-to-r from-[#d4af37] to-[#ffd700] hover:scale-105 hover:shadow-[#d4af37]/60"
      }`}
    >
      {disabled ? "🎟 Sold Out" : "🎫 Get Your Ticket"}
    </button>
  );
}

// Countdown logic
function getTimeLeft(target) {
  const now = new Date().getTime();
  const diff = target - now;
  if (diff <= 0) return ["00", "00", "00"];
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return [pad(hours), pad(minutes), pad(seconds)];
}

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}
