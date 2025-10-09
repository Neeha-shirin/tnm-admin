import { Navbar, Dropdown, TextInput, Badge } from "flowbite-react";
import { HiMenu, HiX, HiSearch, HiBell } from "react-icons/hi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/tnmlogo-SxopM0UJ.png";

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3); // default count
  const navigate = useNavigate();

  // Example: fetch notification count from API (replace with your API)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // const res = await api.get("/notifications/unread-count");
        // setNotificationsCount(res.data.count);
      } catch (err) {
        console.error("Failed to fetch notifications count", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Navbar
      fluid
      rounded
      className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6"
    >
      {/* Logo Section */}
      <Navbar.Brand href="/" className="flex items-center space-x-3">
        <img
          src={logo}
          className="h-8 lg:h-10 transition-transform duration-300 hover:scale-105"
          alt="Company Logo"
        />
        <div className="hidden lg:block border-l border-gray-300 dark:border-gray-600 h-6 mx-2"></div>
        <span className="self-center text-lg lg:text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          Admin Panel
        </span>
      </Navbar.Brand>

      {/* Search Bar */}
      <div className="hidden lg:flex items-center flex-1 justify-center px-8">
        <div className="relative w-full max-w-xl">
          <TextInput
            icon={HiSearch}
            placeholder="Search for analytics, settings..."
            className="w-full rounded-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex md:order-2 items-center gap-4">
        {/* Notification Bell with Dynamic Badge */}
        <button
          onClick={() => navigate("/messages")}
          className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
        >
          <HiBell className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          {notificationsCount > 0 && (
            <Badge color="red" className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] text-xs font-semibold">
              {notificationsCount}
            </Badge>
          )}
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Notifications
          </div>
        </button>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 border border-gray-200 dark:border-gray-700"
          aria-label="Toggle navigation"
        >
          {isOpen ? (
            <HiX className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-transform duration-300 rotate-90" />
          ) : (
            <HiMenu className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-transform duration-300" />
          )}
        </Navbar.Toggle>
      </div>

      {/* Mobile Search Bar */}
      <div className={`${isOpen ? "block" : "hidden"} lg:hidden w-full mt-3 px-2`}>
        <TextInput
          icon={HiSearch}
          placeholder="Search..."
          className="w-full rounded-lg"
        />
      </div>

      {/* Navigation Items */}
      <Navbar.Collapse className={`${isOpen ? "block" : "hidden"} lg:block mt-2 lg:mt-0`}>
        {/* Add your navigation items here */}
      </Navbar.Collapse>
    </Navbar>
  );
};
