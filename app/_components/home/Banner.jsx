"use client";

import React from "react";
import LuxuryWatchTicketCard from "./LuxuryWatchTicketCard";

const Banner = () => {
  // Simulate dynamic countdown end time
  const now = Date.now();

  return (
    <section className="flex flex-col lg:flex-row justify-center gap-8 px-4 py-10 max-w-7xl mx-auto">
      <LuxuryWatchTicketCard
        title="Rolex Daytona"
        imageSrc="/images/watch1.webp"
        countdownEnd={now + 6 * 60 * 60 * 1000} // 6 hours
      />
      <LuxuryWatchTicketCard
        title="Audemars Piguet Royal Oak"
        imageSrc="/images/watch2.webp"
        countdownEnd={now + 3 * 60 * 60 * 1000} // 3 hours
        ticketPrice="$35"
        watchValue="$25,000"
        remainingTickets={85}
      />
    </section>
  );
};

export default Banner;
