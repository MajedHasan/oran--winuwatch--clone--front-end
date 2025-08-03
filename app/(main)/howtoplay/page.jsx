"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  FiList,
  FiCpu,
  FiCreditCard,
  FiAward,
  FiClock,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";

const steps = [
  {
    id: 1,
    icon: <FiList size={28} />,
    title: "CHOOSE",
    description:
      "Choose how many tickets you want (Up to 50 per player) and get ready to own a prestigious timepiece.",
  },
  {
    id: 2,
    icon: <FiCpu size={28} />,
    title: "PLAY",
    description:
      "Test your watch expertise with our online game, meticulously crafted to separate the true connoisseurs from the casual admirers.",
  },
  {
    id: 3,
    icon: <FiCreditCard size={28} />,
    title: "BUY",
    description:
      "Pay Safely to Enter. Our partner Randomdraws uses a third-party Random Number Generator for an impartial and secure winner selection process.",
  },
  {
    id: 4,
    icon: <FiAward size={28} />,
    title: "WIN",
    description:
      "That's all there is to it! With a minimal entry of just £25, you could be the lucky winner of a brand-new £20,000 timepiece.",
  },
];

const extraInfo = [
  {
    icon: <FiClock size={32} className="text-[#d4af37]" />,
    title: "Timely Draws",
    description:
      "Competitions happen on scheduled dates — no postponements unless sold out early. Stay tuned and be ready!",
  },
  {
    icon: <FiInfo size={32} className="text-[#d4af37]" />,
    title: "Transparency Guaranteed",
    description:
      "Our draw uses a third-party certified random number generator ensuring full fairness and impartiality.",
  },
  {
    icon: <FiCheckCircle size={32} className="text-[#d4af37]" />,
    title: "Secure Payment",
    description:
      "All transactions are processed securely via trusted payment partners. Your info is safe and encrypted.",
  },
];

// Hook for Intersection Observer fade-in effect
function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

function Step({ id, icon, title, description }) {
  const ref = useRef(null);
  const isVisible = useInView(ref);

  return (
    <div
      ref={ref}
      tabIndex={0}
      aria-label={`Step ${id}: ${title}`}
      className={`group relative bg-[#1f1f1f] rounded-3xl p-10 shadow-lg cursor-default
      transition-transform duration-300 ease-in-out
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      focus-within:scale-[1.05] focus-within:shadow-2xl hover:scale-[1.05] hover:shadow-2xl
      `}
    >
      {/* Step circle with number + icon */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37] to-yellow-400 text-black font-bold text-lg shadow-xl border-4 border-black">
        <div className="flex flex-col items-center justify-center">
          <span>{id}</span>
          <div className="mt-1">{icon}</div>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-10 mb-5 text-3xl font-extrabold text-[#d4af37] tracking-widest text-center drop-shadow-md">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 leading-relaxed text-center">{description}</p>
    </div>
  );
}

export default function HowToPlay() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1c1c1c] text-white py-24 px-6 md:px-20 select-text">
      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-24">
        <h1 className="text-6xl font-extrabold text-[#d4af37] mb-6 drop-shadow-lg">
          How To Play & Win Your Dream Watch
        </h1>
        <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
          It’s simple, fun, and rewarding. Just follow these steps and get ready
          to win an exclusive £20,000 luxury timepiece.
        </p>
      </header>

      {/* Timeline Section */}
      <section
        className="max-w-6xl mx-auto flex flex-col md:flex-row relative"
        aria-label="Competition steps timeline"
      >
        {/* Vertical timeline line for desktop */}
        <div className="hidden md:block absolute top-16 bottom-16 left-1/2 w-1 bg-gradient-to-b from-[#d4af37] via-yellow-400 to-[#d4af37] rounded-full z-0" />

        {/* Steps container */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-full z-10">
          {steps.map((step) => (
            <Step key={step.id} {...step} />
          ))}
        </div>
      </section>

      {/* Why Play Section */}
      <section className="max-w-5xl mx-auto mt-28 px-4 md:px-0">
        <h2 className="text-5xl font-extrabold text-[#d4af37] mb-12 text-center drop-shadow-lg">
          Why Play With Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {extraInfo.map(({ icon, title, description }, idx) => (
            <div
              key={idx}
              className="flex items-start gap-6 bg-[#1f1f1f] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition"
            >
              <div>{icon}</div>
              <div>
                <h3 className="text-3xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="max-w-5xl mx-auto bg-[#1f1f1f] rounded-3xl p-16 shadow-2xl mt-28 mb-28">
        <h2 className="text-5xl font-extrabold text-[#d4af37] mb-10 text-center drop-shadow-lg">
          Pro Tips to Maximize Your Chances
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-5 max-w-3xl mx-auto text-xl leading-relaxed">
          <li>
            Buy multiple tickets to increase your odds — you can purchase up to
            50 tickets per competition.
          </li>
          <li>
            Engage with our interactive online game to sharpen your watch
            knowledge and skills.
          </li>
          <li>
            Join our vibrant community to get early notifications about upcoming
            competitions.
          </li>
          <li>
            Always double-check your contact details so we can reach you
            immediately if you win.
          </li>
          <li>
            Play regularly — the more you participate, the higher your chance to
            win!
          </li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="max-w-5xl mx-auto px-6 md:px-0 mb-32">
        <h2 className="text-4xl font-extrabold text-[#d4af37] mb-12 text-center drop-shadow-lg">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-8 max-w-4xl mx-auto text-gray-300 text-lg leading-relaxed">
          <div>
            <dt className="font-semibold text-[#d4af37] mb-2">
              How many tickets can I buy?
            </dt>
            <dd>
              You can buy up to 50 tickets per competition to increase your
              chances.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#d4af37] mb-2">
              Is the competition fair?
            </dt>
            <dd>
              Yes, we use a third-party certified random number generator to
              ensure full fairness.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#d4af37] mb-2">
              What payment methods do you accept?
            </dt>
            <dd>
              We accept all major credit cards, PayPal, and secure payment
              options.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[#d4af37] mb-2">
              When are draws held?
            </dt>
            <dd>
              Draws happen on scheduled dates unless the competition sells out
              early.
            </dd>
          </div>
        </dl>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <a
          href="/register"
          className="inline-block bg-gradient-to-r from-[#d4af37] to-yellow-400 text-black font-bold rounded-full px-24 py-6 text-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out"
          role="button"
          aria-label="Join the next competition"
        >
          Join The Next Competition
        </a>
      </section>
    </main>
  );
}
