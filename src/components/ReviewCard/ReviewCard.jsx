import React from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";

const ReviewCard = ({ name, rating, comment }) => {
  return (
    <div className="p-6 bg-white shadow rounded-2xl flex flex-col gap-3">
      {/* Reviewer Info */}
      <div className="flex items-center gap-3">
        <FaUserCircle className="text-gray-500 text-2xl" />
        <span className="font-medium text-gray-700">{name}</span>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(rating)].map((_, i) => (
          <FaStar key={i} />
        ))}
      </div>

      {/* Comment */}
      <p className="text-gray-600">{comment}</p>
    </div>
  );
};

export default ReviewCard;
