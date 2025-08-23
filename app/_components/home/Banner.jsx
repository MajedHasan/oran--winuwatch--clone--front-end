"use client";

import React, { useEffect, useState } from "react";
import LuxuryWatchTicketCard from "./LuxuryWatchTicketCard";
import api from "@/lib/axios";

const Banner = () => {
  const [competitions, setCompetitions] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchCompetitions = async () => {
    try {
      const { data } = await api.get("/competitions", { headers });
      setCompetitions(data.items || []);
    } catch (err) {
      console.error("Failed to fetch competitions", err);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  if (!competitions.length) return null;

  // Take first two competitions for the two cards
  const firstCard = competitions[0];
  const secondCard = competitions[1] || firstCard; // fallback if only one

  return (
    <section className="flex flex-col lg:flex-row justify-center gap-8 px-4 py-10 max-w-7xl mx-auto">
      <LuxuryWatchTicketCard
        id={firstCard._id}
        title={firstCard.title}
        imageSrc={
          firstCard.images?.length
            ? `http://localhost:5001${firstCard.images[0]}`
            : "/images/watch1.webp"
        }
        ticketPrice={`$${firstCard.entryPrice}`}
        watchValue={`$${firstCard.watchValue}`}
        totalTickets={firstCard.maxTickets}
        remainingTickets={firstCard.maxTickets - firstCard.soldTickets}
        countdownEnd={new Date(firstCard.drawDate).getTime()}
      />
      <LuxuryWatchTicketCard
        id={secondCard._id}
        title={secondCard.title}
        imageSrc={
          secondCard.images?.length > 1
            ? `http://localhost:5001${secondCard.images[1]}`
            : "/images/watch2.webp"
        }
        ticketPrice={`$${secondCard.entryPrice}`}
        watchValue={`$${secondCard.watchValue}`}
        totalTickets={secondCard.maxTickets}
        remainingTickets={secondCard.maxTickets - secondCard.soldTickets}
        countdownEnd={new Date(secondCard.drawDate).getTime()}
      />
    </section>
  );
};

export default Banner;
