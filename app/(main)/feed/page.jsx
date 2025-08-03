"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FiSearch,
  FiTag,
  FiClock,
  FiArrowRight,
  FiUser,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiInstagram,
} from "react-icons/fi";

// Sample articles data — add more as you want
const articles = [
  {
    id: 1,
    title: "The Rise of Luxury Watch Collecting",
    excerpt:
      "Discover why luxury watches have become the ultimate status symbol for discerning collectors worldwide.",
    image: "/images/watch1.webp",
    date: "2025-07-15",
    category: "Lifestyle",
    tags: ["Luxury", "Collecting"],
    readingTime: 8,
    author: { name: "Aisha Khan", avatar: "/avatars/aisha.jpg" },
    featured: true,
  },
  {
    id: 2,
    title: "Understanding Mechanical Movements",
    excerpt:
      "Learn how mechanical watch movements work, and why enthusiasts swear by them over quartz.",
    image: "/images/watch2.webp",
    date: "2025-07-10",
    category: "Tech",
    tags: ["Mechanical", "Tech"],
    readingTime: 10,
    author: { name: "John Doe", avatar: "/avatars/john.jpg" },
    featured: false,
  },
  {
    id: 3,
    title: "How to Spot a Fake Rolex",
    excerpt:
      "A comprehensive guide to help you avoid counterfeit watches and make safe purchases.",
    image: "/images/watch1.webp",
    date: "2025-06-28",
    category: "Guide",
    tags: ["Guide", "Rolex"],
    readingTime: 7,
    author: { name: "Sara Lee", avatar: "/avatars/sara.jpg" },
    featured: false,
  },
  {
    id: 4,
    title: "Interview with a Master Watchmaker",
    excerpt:
      "Insights into the artistry, precision, and passion behind crafting exceptional timepieces.",
    image: "/images/watch2.webp",
    date: "2025-06-20",
    category: "Interview",
    tags: ["Interview", "Craftsmanship"],
    readingTime: 12,
    author: { name: "Michael Smith", avatar: "/avatars/michael.jpg" },
    featured: false,
  },
  {
    id: 5,
    title: "History of the Iconic Daytona",
    excerpt:
      "Explore the fascinating evolution and legacy of the Rolex Daytona chronograph.",
    image: "/images/watch1.webp",
    date: "2025-07-01",
    category: "History",
    tags: ["History", "Rolex"],
    readingTime: 9,
    author: { name: "Aisha Khan", avatar: "/avatars/aisha.jpg" },
    featured: false,
  },
  {
    id: 6,
    title: "Best Watches for Investment in 2025",
    excerpt:
      "Which watches hold their value best? We break down the top investment picks.",
    image: "/images/watch2.webp",
    date: "2025-07-18",
    category: "Investment",
    tags: ["Investment", "Luxury"],
    readingTime: 11,
    author: { name: "John Doe", avatar: "/avatars/john.jpg" },
    featured: false,
  },
  // Add more if needed
];

// Categories and Tags
const categories = [
  "All",
  "Lifestyle",
  "Tech",
  "Guide",
  "Interview",
  "History",
  "Investment",
];

const allTags = [
  "Luxury",
  "Collecting",
  "Mechanical",
  "Tech",
  "Guide",
  "Rolex",
  "Interview",
  "Craftsmanship",
  "History",
  "Investment",
];

export default function FeedPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTags, setActiveTags] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [email, setEmail] = useState("");

  // Filter articles based on search, category, and tags
  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) =>
        activeCategory === "All" ? true : article.category === activeCategory
      )
      .filter((article) =>
        activeTags.length > 0
          ? activeTags.every((tag) => article.tags.includes(tag))
          : true
      )
      .filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
  }, [searchTerm, activeCategory, activeTags]);

  // Load more articles
  const loadMore = () => {
    setVisibleCount((count) => count + 3);
  };

  // Toggle tag filter
  const toggleTag = (tag) => {
    setActiveTags((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Reading time text helper
  const readingTimeText = (min) => `${min} min read`;

  // Subscription submit handler (just mock)
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  // Carousel auto slide for featured (bonus)
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const featuredArticles = filteredArticles.filter((a) => a.featured);
  useEffect(() => {
    if (featuredArticles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFeatured((prev) => (prev + 1) % featuredArticles.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featuredArticles]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1c1c1c] text-white px-6 md:px-20 py-24 select-none">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto mb-20 text-center">
        <h1 className="text-6xl font-extrabold text-[#d4af37] mb-4 drop-shadow-xl">
          Dive Into The World Of Watches
        </h1>
        <p className="text-gray-400 max-w-4xl mx-auto text-xl leading-relaxed mb-8">
          From expert guides to exclusive interviews and market insights — all
          in one elegant place.
        </p>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <input
            type="search"
            placeholder="Search articles, categories, tags..."
            className="w-full rounded-full bg-[#1f1f1f] py-4 px-16 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch
            size={28}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-[#d4af37]"
          />
        </div>
      </header>

      {/* Categories */}
      <nav className="max-w-7xl mx-auto flex gap-5 overflow-x-auto mb-12 px-2 scrollbar-thin scrollbar-thumb-[#d4af37]/70 scrollbar-track-[#1f1f1f]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-2 font-semibold transition select-none ${
              activeCategory === cat
                ? "bg-[#d4af37] text-black shadow-lg"
                : "bg-[#2a2a2a] text-gray-400 hover:bg-[#d4af37]/80 hover:text-black"
            }`}
            aria-pressed={activeCategory === cat}
          >
            <FiTag />
            {cat}
          </button>
        ))}
      </nav>

      {/* Tags filter */}
      <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto mb-14 px-2 scrollbar-thin scrollbar-thumb-[#d4af37]/70 scrollbar-track-[#1f1f1f]">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition select-none ${
              activeTags.includes(tag)
                ? "bg-[#d4af37] text-black shadow-lg"
                : "bg-[#2a2a2a] text-gray-400 hover:bg-[#d4af37]/80 hover:text-black"
            }`}
            aria-pressed={activeTags.includes(tag)}
          >
            <FiTag />
            {tag}
          </button>
        ))}
      </div>

      {/* Featured Carousel */}
      {featuredArticles.length > 0 && (
        <div className="max-w-7xl mx-auto mb-20 relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-[#3e2f1a] to-[#d4af37]/70">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              width: `${featuredArticles.length * 100}%`,
              transform: `translateX(-${
                (100 / featuredArticles.length) * currentFeatured
              }%)`,
            }}
          >
            {featuredArticles.map(
              ({
                id,
                title,
                excerpt,
                image,
                date,
                category,
                author,
                readingTime,
              }) => (
                <article
                  key={id}
                  className="w-full flex flex-col md:flex-row gap-8 p-10"
                >
                  <div className="flex-shrink-0 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] transition-transform duration-500">
                    <img
                      src={image}
                      alt={title}
                      loading="lazy"
                      className="w-full h-80 object-cover rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col justify-between text-white md:w-1/2">
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-widest text-[#d4af37]">
                        {category}
                      </span>
                      <h2 className="mt-2 text-4xl font-extrabold leading-tight">
                        {title}
                      </h2>
                      <p className="mt-4 text-gray-200 text-lg">{excerpt}</p>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 mt-8">
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <FiUser size={20} />
                        <span>{author.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <FiClock size={20} />
                        <span>{readingTimeText(readingTime)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </div>
                    </div>

                    <button
                      className="mt-8 inline-flex items-center gap-3 bg-black bg-opacity-30 backdrop-blur-md border border-[#d4af37] hover:bg-[#d4af37] hover:text-black transition rounded-full px-8 py-3 font-bold cursor-pointer shadow-lg self-start"
                      onClick={() => alert(`Read more: ${title}`)}
                    >
                      Read More <FiArrowRight />
                    </button>
                  </div>
                </article>
              )
            )}
          </div>

          {/* Carousel controls */}
          <div className="absolute top-1/2 right-6 flex space-x-4 -translate-y-1/2">
            {featuredArticles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFeatured(idx)}
                className={`w-4 h-4 rounded-full ${
                  idx === currentFeatured ? "bg-[#d4af37]" : "bg-gray-600"
                }`}
                aria-label={`Go to featured article ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Articles Masonry Grid */}
      <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredArticles
          .filter((a) => !a.featured)
          .slice(0, visibleCount)
          .map(
            ({
              id,
              title,
              excerpt,
              image,
              date,
              category,
              tags,
              readingTime,
              author,
            }) => (
              <article
                key={id}
                className="relative group mb-6 break-inside-avoid rounded-2xl overflow-hidden shadow-lg bg-[#1f1f1f] cursor-pointer"
                onClick={() => alert(`Read article: ${title}`)}
              >
                <div className="overflow-hidden rounded-t-2xl">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-6 flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#d4af37] text-black text-xs font-semibold rounded-full px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-white leading-tight">
                    {title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-4">
                    {excerpt}
                  </p>

                  <div className="flex justify-between items-center mt-4 text-gray-400 text-xs italic">
                    <div className="flex items-center gap-2">
                      <FiUser />
                      <span>{author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>{readingTimeText(readingTime)}</span>
                    </div>
                    <time dateTime={date}>{formatDate(date)}</time>
                  </div>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <button
                    className="bg-[#d4af37] text-black font-bold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-400 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Read more: ${title}`);
                    }}
                  >
                    Read More
                  </button>
                </div>
              </article>
            )
          )}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredArticles.length && (
        <div className="max-w-7xl mx-auto mt-16 text-center">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-3 bg-[#d4af37] text-black font-semibold px-10 py-4 rounded-full hover:bg-yellow-400 transition shadow-lg cursor-pointer"
          >
            Load More Articles <FiArrowRight />
          </button>
        </div>
      )}

      {/* Subscribe Section */}
      <section className="max-w-7xl mx-auto mt-24 px-6 py-16 rounded-3xl bg-gradient-to-r from-[#3e2f1a] to-[#d4af37]/80 shadow-xl text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-black drop-shadow-lg">
          Stay Updated With The Latest
        </h2>
        <p className="text-black max-w-3xl mx-auto mb-8 text-lg">
          Subscribe to our newsletter for exclusive updates, contests, and watch
          news.
        </p>
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 rounded-full py-4 px-6 text-black placeholder-gray-700 focus:outline-none focus:ring-4 focus:ring-[#d4af37]"
          />
          <button
            type="submit"
            className="bg-black text-[#d4af37] font-bold rounded-full px-10 py-4 hover:bg-yellow-400 hover:text-black transition shadow-lg"
          >
            Subscribe
          </button>
        </form>

        {/* Socials */}
        <div className="mt-10 flex justify-center gap-8 text-black text-3xl select-none">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="hover:text-yellow-400 transition"
          >
            <FiFacebook />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
            className="hover:text-yellow-400 transition"
          >
            <FiTwitter />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hover:text-yellow-400 transition"
          >
            <FiInstagram />
          </a>
        </div>
      </section>
    </section>
  );
}
