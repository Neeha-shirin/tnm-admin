"use client";

import React, { useState, useEffect } from "react";
import {
  Sidebar as FlowbiteSidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  Modal,
  Button,
} from "flowbite-react";
import {
  HiBookOpen,
  HiStar,
  HiChatAlt2,
  HiChartBar,
  HiLogout,
  HiUserGroup,
  HiAcademicCap,
  HiCollection,
  HiCash,
  HiUser,
  HiDocumentText,
  HiMenu,
  HiX,
  HiShieldCheck,
  HiReceiptRefund,
  HiQuestionMarkCircle,
  HiClipboardList,
} from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api";

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [role, setRole] = useState("");

  // Update active item based on current route
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "");
  }, []);

  const handleLogout = async () => {
  try {
    await api.post("/logout/");
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    // ✅ Clear everything from storage
    localStorage.clear();

    // ✅ Redirect to login page and prevent back navigation
    navigate("/login", { replace: true });

    // ✅ Optional: small delay to ensure navigation completes before blocking back
    setTimeout(() => {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
      };
    }, 100);
  }
};


  const menuItems = [
    {
      path: "/",
      icon: HiChartBar,
      label: "Dashboard",
      color: "emerald",
      roles: ["admin", "monitor", "financier"],
    },
    {
      path: "/user",
      icon: HiUser,
      label: "Users",
      color: "emerald",
      roles: ["admin"],
    },
    {
      path: "/tutor",
      icon: HiAcademicCap,
      label: "Tutors",
      color: "emerald",
      roles: ["admin", "monitor"],
    },
    {
      path: "/student",
      icon: HiUserGroup,
      label: "Students / Leads",
      color: "emerald",
      roles: ["admin", "monitor"],
    },
    {
      path: "/course",
      icon: HiCollection,
      label: "Courses & Categories",
      color: "emerald",
      roles: ["admin", "monitor"],
    },
    {
      path: "/assignment",
      icon: HiBookOpen,
      label: "Tutor Assigning",
      color: "emerald",
      roles: ["admin", "monitor"],
    },
    {
      path: "/studentassign",
      icon: HiUserGroup,
      label: "Student Assigning",
      color: "emerald",
      roles: ["admin", "monitor"],
    },
    {
      path: "/payment",
      icon: HiCash,
      label: "Tutor Plan",
      color: "emerald",
      roles: ["admin","financier"],
    },
    {
      path: "/studentpayment",
      icon: HiCash,
      label: "Students Plan",
      color: "emerald",
      roles: ["admin", "financier"],
    },
    
    {
      path: "/testmonio",
      icon: HiStar,
      label: "Testimonials",
      color: "emerald",
      roles: ["admin"],
    },
    {
      path: "/blog",
      icon: HiDocumentText,
      label: "Blog",
      color: "emerald",
      roles: ["admin"],
    },

    
    {
      path: "/faq",
      icon: HiQuestionMarkCircle,
      label: "faq",
      color: "emerald",
      roles: ["admin"],
    },
    {
      path: "/privacy",
      icon: HiShieldCheck,
      label: "Privacy",
      color: "emerald",
      roles: ["admin"],
    },
    {
      path: "/terms",
      icon: HiClipboardList,
      label: "Terms & Conditions",
      color: "emerald",
      roles: ["admin"],
    },
     {path: "/contact",
      icon: HiUserGroup,
      label: "Contact info",
      color: "emerald",
      roles: ["admin"],
    },
    {
      path: "/refund",
      icon: HiReceiptRefund,
      label: "Refund Policy",
      color: "emerald",
      roles: ["admin"],
    },
    {
      path: "/backup",
      icon: HiReceiptRefund,
      label: "Backup Data",
      color: "emerald",
      roles: ["admin"],
    },
  ];

  const getColorClasses = (color, isActive = false, disabled = false) => {
    if (disabled)
      return "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100";
    const colorMap = {
      blue: isActive
        ? "bg-blue-50 text-blue-600 border-blue-200"
        : "hover:bg-blue-50 hover:text-blue-600",
      emerald: isActive
        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
        : "hover:bg-emerald-50 hover:text-emerald-600",
      purple: isActive
        ? "bg-purple-50 text-purple-600 border-purple-200"
        : "hover:bg-purple-50 hover:text-purple-600",
      orange: isActive
        ? "bg-orange-50 text-orange-600 border-orange-200"
        : "hover:bg-orange-50 hover:text-orange-600",
      pink: isActive
        ? "bg-pink-50 text-pink-600 border-pink-200"
        : "hover:bg-pink-50 hover:text-pink-600",
      indigo: isActive
        ? "bg-indigo-50 text-indigo-600 border-indigo-200"
        : "hover:bg-indigo-50 hover:text-indigo-600",
      green: isActive
        ? "bg-green-50 text-green-600 border-green-200"
        : "hover:bg-green-50 hover:text-green-600",
      red: isActive
        ? "bg-red-50 text-red-600 border-red-200"
        : "hover:bg-red-50 hover:text-red-600",
      yellow: isActive
        ? "bg-yellow-50 text-yellow-600 border-yellow-200"
        : "hover:bg-yellow-50 hover:text-yellow-600",
      teal: isActive
        ? "bg-teal-50 text-teal-600 border-teal-200"
        : "hover:bg-teal-50 hover:text-teal-600",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {/* <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          color="light"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg shadow-lg border border-gray-200"
        >
          {isCollapsed ? null : <HiMenu className="w-5 h-5" />}
        </Button>
      </div> */}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => onClose(false)}
        />
      )}

      <FlowbiteSidebar
        className={`
          h-[100%] bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-100
          transition-all duration-300 ease-in-out z-50 fixed lg:static
          ${
            isOpen
              ? "translate-x-0 top-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isOpen ? "w-64" : "w-64"}
        `}
        aria-label="Admin Sidebar"
      >
        <div className="h-full overflow-y-auto scrollbar-hide">
          {/* Sidebar Header */}
        <div className="px-4 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <HiAcademicCap className="w-6 h-6 text-white" />
            </div>
            <div
              className={`flex-1 transition-all duration-300 ${
                isOpen ? "opacity-100" : "opacity-100"
              }`}
            >
              <h1 className="text-lg font-bold text-gray-800">Admin</h1>
              <p className="text-xs text-gray-500">Management Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <HiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <SidebarItems>
          <SidebarItemGroup className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeItem === item.path;
              const isDisabled = item.roles
                ? !item.roles.includes(role)
                : false;
              const IconComponent = item.icon;

              return (
                <SidebarItem
                  key={item.path}
                  as={isDisabled ? "div" : Link} // 🧠 render a <div> if disabled
                  to={isDisabled ? undefined : item.path}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault(); // 🛑 stop redirect
                      return;
                    }
                    onClose(false);
                  }}
                  icon={IconComponent}
                  className={`
                    py-3 px-3 rounded-xl transition-all duration-200 font-medium
                    transform hover:scale-[1.02] hover:shadow-sm
                    border-2 border-transparent
                    ${getColorClasses(item.color, isActive, isDisabled)}
                    ${isActive ? "shadow-sm scale-[1.02]" : ""}
                  `}
                >
                  <span className="flex items-center justify-between w-full">
                    {item.label}
                    {isActive && (
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    )}
                  </span>
                </SidebarItem>
              );
            })}

            {/* Logout Button */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <SidebarItem
                onClick={() => setShowLogoutModal(true)}
                icon={HiLogout}
                className="py-3 px-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 transform hover:scale-[1.02] font-medium cursor-pointer group"
              >
                <span className="flex items-center justify-between w-32">
                  Logout
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <HiLogout className="w-4 h-4 animate-pulse" />
                  </span>
                </span>
              </SidebarItem>
            </div>
          </SidebarItemGroup>
        </SidebarItems>

        {/* Sidebar Footer */}
        <div className="px-4 py-4 border-t border-gray-100 mt-auto">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <HiStar className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-emerald-800">Plans</p>
                <p className="text-xs text-emerald-600">Active</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </FlowbiteSidebar>

      {/* Enhanced Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        size="md"
        popup
        onClose={() => setShowLogoutModal(false)}
        className="backdrop-blur-sm"
      >
        <Modal.Body className="p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <HiLogout className="w-8 h-8 text-red-600 animate-pulse" />
            </div>

            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Ready to Leave?
            </h3>

            <p className="mb-6 text-gray-600">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex justify-center gap-3">
              <Button
                color="light"
                onClick={() => setShowLogoutModal(false)}
                className="px-2 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </Button>
              <Button
                color="failure"
                onClick={handleLogout}
                className="px-2 py-2 text-sm bg-gradient-to-r from-red-600 to-red-700 border border-red-600 rounded-md hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 font-medium shadow-md"
              >
                <HiLogout className="w-3.5 h-3.5 mr-1.5" />
                Yes, Logout
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Custom Animation Styles */}
    </>
  );
}

export default Sidebar;