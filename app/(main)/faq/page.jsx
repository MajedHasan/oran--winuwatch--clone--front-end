"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiChevronDown, FiChevronUp, FiSearch, FiInfo } from "react-icons/fi";
import api from "@/lib/axios";

function AccordionItem({ question, answer, isOpen, onClick }) {
  return (
    <div
      className="border border-gray-700 rounded-xl mb-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex justify-between items-center bg-[#1f1f1f] px-6 py-4">
        <h3 className="text-lg font-semibold text-[#d4af37]">{question}</h3>
        <div className="text-[#d4af37]">
          {isOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
        </div>
      </div>
      <div
        className={`px-6 bg-[#121212] text-gray-300 text-base transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] py-4" : "max-h-0 py-0"
        }`}
        aria-hidden={!isOpen}
      >
        {isOpen && <p>{answer}</p>}
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [openIndices, setOpenIndices] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/faqs", { headers });
        // Group FAQs by category
        const grouped = data.reduce((acc, faq) => {
          const cat = faq.category || "Other";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(faq);
          return acc;
        }, {});
        const formatted = Object.keys(grouped).map((cat) => ({
          category: cat,
          faqs: grouped[cat],
        }));
        setFaqs(formatted);
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert(error.response?.data?.message || "Failed to fetch FAQs");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleItem = (catIdx, faqIdx) => {
    setOpenIndices((prev) => {
      const key = `${catIdx}-${faqIdx}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const filteredFaqData = useMemo(() => {
    return faqs
      .filter((category, idx) =>
        selectedCategory !== null ? idx === selectedCategory : true
      )
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.faqs.length > 0);
  }, [faqs, searchTerm, selectedCategory]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1c1c1c] text-white py-20 px-6 md:px-20">
      <header className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold text-[#d4af37] mb-4 drop-shadow-lg">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
          Have questions? Find answers below or contact us for more info.
        </p>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Categories Sidebar */}
        <nav className="hidden md:block sticky top-24 w-56 bg-[#1f1f1f] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-[#d4af37] mb-6">
            Categories
          </h2>
          <ul>
            <li
              onClick={() => setSelectedCategory(null)}
              className={`mb-3 cursor-pointer px-3 py-2 rounded-md ${
                selectedCategory === null
                  ? "bg-[#d4af37] text-black font-bold"
                  : "hover:bg-[#d4af37]/70 hover:text-black transition"
              }`}
            >
              All
            </li>
            {faqs.map((category, idx) => (
              <li
                key={idx}
                onClick={() => setSelectedCategory(idx)}
                className={`mb-3 cursor-pointer px-3 py-2 rounded-md ${
                  selectedCategory === idx
                    ? "bg-[#d4af37] text-black font-bold"
                    : "hover:bg-[#d4af37]/70 hover:text-black transition"
                }`}
              >
                {category.category}
              </li>
            ))}
          </ul>
        </nav>

        {/* FAQ Content */}
        <main className="flex-1 max-w-4xl">
          <div className="relative mb-12">
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full rounded-xl bg-[#1f1f1f] py-4 px-14 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch
              size={24}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]"
            />
          </div>

          {loading && (
            <p className="text-gray-400 text-center text-lg mt-16">
              Loading FAQs...
            </p>
          )}

          {!loading && filteredFaqData.length === 0 && (
            <p className="text-gray-400 text-center text-lg mt-16">
              No FAQs match your search.
            </p>
          )}

          {!loading &&
            filteredFaqData.map(({ category, faqs }, catIdx) => (
              <section key={catIdx} className="mb-16">
                <h3 className="text-3xl font-bold mb-8 text-[#d4af37] border-b border-[#d4af37]/50 pb-2">
                  {category}
                </h3>
                {faqs.map(({ question, answer }, faqIdx) => (
                  <AccordionItem
                    key={faqIdx}
                    question={question}
                    answer={answer}
                    isOpen={!!openIndices[`${catIdx}-${faqIdx}`]}
                    onClick={() => toggleItem(catIdx, faqIdx)}
                  />
                ))}
              </section>
            ))}

          <div className="mt-20 p-10 bg-[#1f1f1f] rounded-3xl text-center shadow-lg">
            <FiInfo
              size={48}
              className="mx-auto mb-4 text-[#d4af37] animate-pulse"
              aria-hidden="true"
            />
            <h4 className="text-2xl font-semibold mb-2">
              Still have questions?
            </h4>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              We're here to help. Contact our support team anytime and we'll get
              back to you promptly.
            </p>
            <a
              href="/contact-us"
              className="inline-block bg-[#d4af37] hover:bg-yellow-400 transition rounded-full px-8 py-4 font-bold text-black text-lg shadow-lg cursor-pointer"
            >
              Contact Us
            </a>
          </div>
        </main>
      </div>
    </section>
  );
}
