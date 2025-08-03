"use client";

export default function WinnersSection() {
  const winners = [
    {
      title: "Rolex Blue Dial Low Cost Competition",
      date: "Won 21.07.2025",
      value: "Value £38k",
      image: "/images/watch1.webp",
    },
    {
      title: "Audemars Piguet Royal Oak",
      date: "Won 15.06.2025",
      value: "Value £45k",
      image: "/images/watch2.webp",
    },
    {
      title: "Omega Seamaster Diver",
      date: "Won 01.05.2025",
      value: "Value £12k",
      image: "/images/watch1.webp",
    },
    {
      title: "Tag Heuer Monaco",
      date: "Won 28.04.2025",
      value: "Value £7k",
      image: "/images/watch2.webp",
    },
    {
      title: "Patek Philippe Nautilus",
      date: "Won 12.03.2025",
      value: "Value £60k",
      image: "/images/watch1.webp",
    },
    {
      title: "Hublot Big Bang Unico",
      date: "Won 20.02.2025",
      value: "Value £18k",
      image: "/images/watch2.webp",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#0b0b0b] text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row gap-12 items-center md:items-start">
        <div className="md:w-1/2">
          <h2 className="text-5xl font-extrabold tracking-wide text-gradient-gold leading-tight">
            Our community
            <br />
            <span className="text-white">has won</span>
          </h2>
        </div>
        <div className="md:w-1/2 text-lg max-w-lg leading-relaxed text-gray-300">
          We take pride in meticulously curating a collection of watches that
          embody sophistication and elegance, sourced from a diverse network of
          over 260 partners across the world.
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {winners.map((item, idx) => (
          <div
            key={idx}
            className="relative group rounded-xl overflow-hidden border border-transparent shadow-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0b0b0b] hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.7)] transition-all duration-500 transform hover:-translate-y-2"
          >
            {/* Image with gradient overlay */}
            <div className="relative h-64">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading={idx < 3 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 tracking-wide text-[#d4af37] group-hover:text-[#ffd700] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm uppercase tracking-widest text-gray-400 mb-1">
                {item.date}
              </p>
              <p className="text-lg font-bold text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-24 text-center">
        <button
          className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black font-semibold text-xl rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300"
          aria-label="Join the next competition"
        >
          Join the next competition
        </button>
      </div>

      {/* Gradient Text Styles */}
      <style jsx>{`
        .text-gradient-gold {
          background: linear-gradient(90deg, #d4af37, #ffd700 70%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}
