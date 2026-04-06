import React, { useRef, useEffect } from "react";
import { banners } from "../utils/constant";

function Bannerslider() {
  const containerRef = useRef(null);
  const scrollAmount = 320; // px per slide, adjust to match your widths
  const intervalTime = 1000; // 3 seconds

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollPos = 0;

    const interval = setInterval(() => {
      scrollPos += scrollAmount;
      if (scrollPos > container.scrollWidth - container.clientWidth) {
        scrollPos = 0; // loop back to start
      }
      container.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white py-6">
      <div className="mx-auto px-4">
        <div
          ref={containerRef}
          className="w-full overflow-x-auto snap-x snap-mandatory flex space-x-4 py-6 scrollbar-hide"
        >
          {banners.map((banner, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] sm:w-[600px] md:w-[800px] snap-center rounded-xl overflow-hidden"
            >
              <img
                src={banner}
                alt={`banner-${i}`}
                className="w-full h-[300px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Bannerslider;
