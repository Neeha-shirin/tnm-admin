import React, { useState } from "react";
import { FaStar, FaFilter, FaChevronDown } from "react-icons/fa";

const ReviewCard = ({ name, rating, comment, date }) => (
  <article className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emarald-500 to-emarald-500 flex items-center justify-center text-white font-bold text-lg">
          {name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-yellow-500 bg-yellow-100 px-3 py-1 rounded-full font-semibold text-sm">
        <FaStar /> {rating}.0
      </div>
    </div>

    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`transition-colors duration-300 cursor-pointer ${i < rating ? "text-yellow-400 hover:text-yellow-500" : "text-gray-300 hover:text-yellow-200"}`}
        />
      ))}
    </div>

    <p className="text-gray-700 leading-relaxed text-sm">{comment}</p>
  </article>
);

const RatingSummary = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => distribution[r.rating]++);

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-center md:text-left">
        <h2 className="text-5xl font-extrabold">{averageRating.toFixed(1)}</h2>
        <div className="flex justify-center md:justify-start gap-1 my-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`transition-colors duration-300 ${i < Math.round(averageRating) ? "text-yellow-300 hover:text-yellow-400" : "text-white opacity-50 hover:opacity-75"}`}
            />
          ))}
        </div>
        <p className="text-sm opacity-90">{totalReviews} reviews</p>
      </div>

      <div className="flex-1 w-full">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-3 mb-2">
            <span className="w-12 text-sm font-medium">{rating}★</span>
            <div className="flex-1 h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${(distribution[rating] / totalReviews) * 100}%` }}
              ></div>
            </div>
            <span className="w-12 text-right text-sm font-medium">{Math.round((distribution[rating] / totalReviews) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:scale-105 ${
      active ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

export default function Reviews() {
  const allReviews = [
    { id: 1, name: "Alice Johnson", rating: 5, comment: "Excellent course! Very detailed and easy to follow.", date: "2023-08-01" },
    { id: 2, name: "Bob Smith", rating: 4, comment: "Really good, but could use more practical examples.", date: "2023-07-25" },
    { id: 3, name: "Catherine Lee", rating: 5, comment: "Loved it! Super clear explanations.", date: "2023-07-20" },
    { id: 4, name: "David Brown", rating: 3, comment: "Average, some topics were rushed.", date: "2023-07-15" },
    { id: 5, name: "Emma Wilson", rating: 4, comment: "Good course with helpful resources.", date: "2023-07-10" },
    { id: 6, name: "Michael Taylor", rating: 5, comment: "Absolutely worth every penny!", date: "2023-07-01" },
    { id: 7, name: "Sophia Martinez", rating: 2, comment: "Expected more advanced content.", date: "2023-06-28" },
    { id: 8, name: "James Anderson", rating: 4, comment: "Well-structured content with exercises.", date: "2023-06-20" },
  ];

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredReviews = allReviews.filter((r) => (filter === "all" ? true : r.rating === parseInt(filter)));

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    return 0;
  });

  const visibleReviews = sortedReviews.slice(0, visibleCount);

  const filters = [
    { label: "All", value: "all" },
    { label: "5 Stars", value: "5" },
    { label: "4 Stars", value: "4" },
    { label: "3 Stars", value: "3" },
    { label: "2 Stars", value: "2" },
    { label: "1 Star", value: "1" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">⭐ Student Reviews</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {allReviews.length} reviews with an average rating of {(allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)} out of 5.
          </p>
        </header>

        <RatingSummary reviews={allReviews} />

        <section className="bg-white p-5 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
              <FaFilter /> Filter by:
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map(({ label, value }) => (
                <FilterButton key={value} active={filter === value} onClick={() => setFilter(value)}>
                  {label}
                </FilterButton>
              ))}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium hover:scale-105 transition-transform"
            >
              Sort by: {sortBy === "newest" ? "Newest" : sortBy === "highest" ? "Highest Rated" : "Lowest Rated"}
              <FaChevronDown className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10">
                {[
                  { label: "Newest", value: "newest" },
                  { label: "Highest Rated", value: "highest" },
                  { label: "Lowest Rated", value: "lowest" },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSortBy(value);
                      setShowFilters(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-medium transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          {visibleReviews.length === 0 ? (
            <p className="text-center text-gray-500 italic">No reviews found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleReviews.map((r) => (
                <ReviewCard key={r.id} {...r} />
              ))}
            </div>
          )}
        </section>

        {visibleCount < sortedReviews.length && (
          <div className="text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
