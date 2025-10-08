import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  return (
    <div className="flex justify-center">
      <div
        className="
      flex bg-gray-900/80 backdrop-blur-md border-0 rounded-full
      space-x-1 text-white mt-5 p-1 
      transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(100,180,255)]"
      >
        {/* Simulator Button */}
        <Link
          to="/"
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-500 ${
            location.pathname === "/"
              ? "bg-[rgb(100,180,255)] shadow-sm"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          Investment Simulator
        </Link>

        {/* About Button */}
        <Link
          to="/about"
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-500 ${
            location.pathname === "/about"
              ? "bg-[rgb(100,180,255)] shadow-sm"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          About
        </Link>
      </div>
    </div>
  );
}
