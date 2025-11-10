import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-gray-800 p-6 relative overflow-hidden">
      {/* 404 Heading */}
      <h1 className="text-[6rem] sm:text-[8rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600">
        404
      </h1>

      {/* Subtitle */}
      <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
        Oops! Page not found
      </h2>

      {/* Description */}
      <p className="mt-3 text-gray-600 text-center max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Go Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md shadow-md transition-all duration-300 hover:scale-105"
      >
        <Home size={18} />
        Go Home
      </button>

      {/* Footer */}
      <div className="absolute bottom-8 text-sm text-gray-400">
        © {new Date().getFullYear()} TUTOR NEAR ME. All rights reserved.
      </div>
    </div>
  );
}