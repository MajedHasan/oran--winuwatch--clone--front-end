// app/_components/home/HowToEnterSection.jsx
import { Trophy, MousePointerClick, CreditCard, Gift } from "lucide-react";

export default function HowToEnterSection() {
  const steps = [
    {
      title: "Choose",
      desc: "Choose how many tickets you want (Up to 50 per player) and get ready to own a prestigious timepiece.",
      icon: MousePointerClick,
    },
    {
      title: "Play",
      desc: "Test your watch expertise with our online game, crafted to separate true connoisseurs from casual admirers.",
      icon: Trophy,
    },
    {
      title: "Buy",
      desc: "Pay safely to enter. Our partner Randomdraws uses RNG for a fair and secure winner selection process.",
      icon: CreditCard,
    },
    {
      title: "Win",
      desc: "That's it! With just £25, you could win a brand-new £20,000 luxury watch.",
      icon: Gift,
    },
  ];

  return (
    <section className="py-20 px-6 bg-[#f9f9f9] dark:bg-[#0c0c0c]">
      {/* Top Text */}
      <div className="max-w-6xl mx-auto mb-20 flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-extrabold text-[#d4af37]">
            How to{" "}
            <span className="text-black dark:text-white">
              Enter the competition
            </span>
          </h2>
        </div>
        <div className="md:w-1/2 text-gray-600 dark:text-gray-300 text-lg">
          Get a chance to win the next contest and get your dream watch. No
          matter how many tickets are sold, the competition will take place and
          there will be a winner. The date of the competition cannot be
          postponed; however, it can be moved up in case of a sold-out event.
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-16 md:space-y-0 md:space-x-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center relative w-full md:w-1/4 px-4"
            >
              {/* Line Connector */}
              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute top-7 right-0 w-full h-1 bg-[#d4af37]/50 z-0 translate-x-1/2"></div>
              )}

              {/* Icon Circle */}
              <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[#d4af37] mb-4 shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Title + Description */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <button className="px-6 py-3 bg-[#d4af37] text-white font-semibold text-lg rounded-full shadow-md hover:bg-[#bfa231] transition">
          Join the next competition
        </button>
      </div>
    </section>
  );
}
