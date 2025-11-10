import { Navbar, TextInput, Badge } from "flowbite-react";
import { HiMenu, HiSearch, HiBell } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/tnmlogo-SxopM0UJ.png";
import api from "../../api"; // ✅ ensure correct path

export const UserNavbar = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token before API call:", token);

        const res = await api.get("/notify_count/");

      

        if (res.data) {
          setNotificationsCount(res.data.notify_count);
        } else {
          setNotificationsCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch notifications count", err);
      }
    };

    fetchNotificationsCount();
    const interval = setInterval(fetchNotificationsCount, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar
      fluid
      rounded
      className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6"
    >
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition lg:hidden"
      >
        <HiMenu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Brand */}
      <Navbar.Brand href="/" className="flex items-center space-x-3">
        <img src={logo} className="h-8 lg:h-10" alt="Company Logo" />
        <span className="hidden lg:block text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Admin Panel
        </span>
      </Navbar.Brand>

      {/* Search Bar */}
      <div className="hidden lg:flex items-center flex-1 justify-center px-8">
        <TextInput
          icon={HiSearch}
          placeholder="Search..."
          className="w-full rounded-lg"
        />
      </div>

      {/* Right side */}
      <div className="flex md:order-2 items-center gap-4">
        <button
          onClick={() => navigate("/messages")}
          className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
        >
          <HiBell className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 z-10">
              {notificationsCount}
            </span>
          )}
        </button>
      </div>
    </Navbar>
  );
};
