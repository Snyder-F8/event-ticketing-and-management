import React from "react";
import Bannerslider from "../components/Bannerslider";
import EventFilters from "../components/events/EventFilters";
import EventList from "../components/events/EventList";

const Events = () => {
  return (
    <div>
      <Bannerslider />
      <div className="flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen md:px-[100] pb-10 pt-8">
        <EventFilters />
        <EventList />
      </div>
    </div>
  );
};

export default Events;
