"use client";

import Image from "next/image";

const articles = [
  {
    id: 1,
    image: "/images/watch1.webp",
    title: "The Evolution of Luxury Watches",
    date: "July 20, 2025",
    excerpt:
      "Discover how watchmaking has evolved over centuries to become an art and science of precision and style.",
    span: "md:col-span-2 col-span-1", // wider on md+, full width on sm
  },
  {
    id: 2,
    image: "/images/watch2.webp",
    title: "Top 5 Watches for New Collectors",
    date: "August 1, 2025",
    excerpt:
      "A guide for beginners: these timepieces blend style, value, and quality perfectly for your collection.",
    span: "col-span-1",
  },
  {
    id: 3,
    image: "/images/watch1.webp",
    title: "Maintaining Your Mechanical Watch",
    date: "June 15, 2025",
    excerpt:
      "Keep your mechanical watch running smoothly with these essential maintenance tips.",
    span: "col-span-1",
  },
  {
    id: 4,
    image: "/images/watch2.webp",
    title: "Iconic Watch Designs Through History",
    date: "July 5, 2025",
    excerpt:
      "Explore timeless designs that have defined the luxury watch industry over the decades.",
    span: "md:col-span-2 col-span-1",
  },
];

export default function WatchFeedSection() {
  return (
    <section className="bg-[#0b0b0b] py-20 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-extrabold leading-tight tracking-wide bg-gradient-to-r from-[#d4af37] to-[#ffd700] bg-clip-text text-transparent">
            Because we love <br /> everything about watches
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
            Whether you're a seasoned watch enthusiast or just beginning your
            journey into the world of timepieces, our feed is designed to keep
            you informed and inspired.
          </p>
        </div>

        {/* Responsive Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(({ id, image, title, date, excerpt, span }) => (
            <article
              key={id}
              className={`bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ${span}`}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (min-width: 768px) 33vw"
                  priority={id <= 2}
                />
              </div>
              <div className="p-6">
                <time
                  dateTime={date}
                  className="text-sm text-[#d4af37] font-semibold"
                >
                  {date}
                </time>
                <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-gray-300 text-sm">{excerpt}</p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-black font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
}
