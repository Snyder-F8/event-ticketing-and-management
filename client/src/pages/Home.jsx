import React from "react";
import Bannerslider from "../components/Bannerslider.jsx";
import Recommended from "../components/Recommended.jsx";
import LiveEvents from "../components/LiveEvents.jsx";

const Home = () => {
  return (
    <div>
      <Bannerslider />
      <Recommended />
      <LiveEvents />
    </div>
  );
};

export default Home;
