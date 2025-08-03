import React from "react";
import Banner from "../_components/home/Banner";
import WinSection from "../_components/home/WinSection";
import WinnerSlider from "../_components/home/WinnerSlider";
import HowToEnterSection from "../_components/home/HowToEnterSection";
import WinnersSection from "../_components/home/WinnersSection";
import WatchFeedSection from "../_components/home/WatchFeedSection";
import EnterCompetitionSection from "../_components/home/EnterCompetitionSection";
import UpcomingCompetitions from "../_components/home/UpcomingCompetitions";

const page = () => {
  return (
    <>
      <Banner />
      <WinSection />
      <WinnerSlider />
      <HowToEnterSection />
      <WinnersSection />
      <WatchFeedSection />
      <EnterCompetitionSection />
      <UpcomingCompetitions />
    </>
  );
};

export default page;
