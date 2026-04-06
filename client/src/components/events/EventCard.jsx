import React from "react";

const EventCard = ({ img, title, rating, votes, age, languages }) => {
  return (
    <div className="w-40 md:w-52 cursor-pointer">
      <img
        src={img}
        alt={title}
        className="w-full h-[300px] object-cover rounded-lg shadow-md"
      />

      <p className="mt-2 font-medium">{title}</p>

      <p className="text-xs text-gray-500">
        {rating} | {votes}
      </p>

      <p className="text-sm text-gray-600">{age}</p>

      <p className="text-sm text-gray-500">{languages}</p>
    </div>
  );
};

export default EventCard;
