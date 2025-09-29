"use client";

import React, { useState, useEffect } from "react";
import { 
  Sidebar as FlowbiteSidebar, 
  SidebarItem, 
  SidebarItemGroup, 
  SidebarItems, 
  Modal, 
  Button 
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
  HiX
} from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  // Update active item based on current route
  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/logout/");
      localStorage.removeItem("token");
      setShowLogoutModal(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("token");
      setShowLogoutModal(false);
      navigate("/login");
    }
  };

  const menuItems = [
    { path: "/", icon: HiChartBar, label: "Dashboard", color: "blue" },
    { path: "/tutor", icon: HiAcademicCap, label: "Tutors", color: "emerald" },
    { path: "/student", icon: HiUserGroup, label: "Students / Leads", color: "purple" },
    { path: "/course", icon: HiCollection, label: "Courses & Categories", color: "orange" },
    { path: "/assignment", icon: HiBookOpen, label: "Tutor Assigning", color: "pink" },
    { path: "/studentassign", icon: HiUserGroup, label: "Student Assigning", color: "indigo" },
    { path: "/payment", icon: HiCash, label: "Package & Payments", color: "green" },
    { path: "/user", icon: HiUser, label: "Users", color: "red" },
    { path: "/testmonio", icon: HiStar, label: "Testimonials", color: "yellow" },
    { path: "/blog", icon: HiDocumentText, label: "Blog", color: "teal" },
    { path: "/chat", icon: HiChatAlt2, label: "Messages / Chat", color: "blue" },
  ];

  const getColorClasses = (color, isActive = false) => {
    const colorMap = {
      blue: isActive ? "bg-blue-50 text-blue-600 border-blue-200" : "hover:bg-blue-50 hover:text-blue-600",
      emerald: isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "hover:bg-emerald-50 hover:text-emerald-600",
      purple: isActive ? "bg-purple-50 text-purple-600 border-purple-200" : "hover:bg-purple-50 hover:text-purple-600",
      orange: isActive ? "bg-orange-50 text-orange-600 border-orange-200" : "hover:bg-orange-50 hover:text-orange-600",
      pink: isActive ? "bg-pink-50 text-pink-600 border-pink-200" : "hover:bg-pink-50 hover:text-pink-600",
      indigo: isActive ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "hover:bg-indigo-50 hover:text-indigo-600",
      green: isActive ? "bg-green-50 text-green-600 border-green-200" : "hover:bg-green-50 hover:text-green-600",
      red: isActive ? "bg-red-50 text-red-600 border-red-200" : "hover:bg-red-50 hover:text-red-600",
      yellow: isActive ? "bg-yellow-50 text-yellow-600 border-yellow-200" : "hover:bg-yellow-50 hover:text-yellow-600",
      teal: isActive ? "bg-teal-50 text-teal-600 border-teal-200" : "hover:bg-teal-50 hover:text-teal-600",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          color="light"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg shadow-lg border border-gray-200"
        >
          {isCollapsed ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCollapsed(false)}
        />
      )}

      <FlowbiteSidebar 
        className={`
          h-[100%] bg-gradient-to-b from-white to-gray-50 shadow-xl border-r border-gray-100
          transition-all duration-300 ease-in-out z-50 fixed lg:static
          ${isCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-64' : 'w-64'}
        `}
        aria-label="Admin Sidebar"
      >
        {/* Sidebar Header */}
        <div className="px-4 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <HiAcademicCap className="w-6 h-6 text-white" />
            </div>
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'opacity-100' : 'opacity-100'}`}>
              <h1 className="text-lg font-bold text-gray-800">Admin</h1>
              <p className="text-xs text-gray-500">Management Portal</p>
            </div>
          </div>
        </div>

        <SidebarItems>
          <SidebarItemGroup className="space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const isActive = activeItem === item.path;
              const IconComponent = item.icon;
              
              return (
                <SidebarItem 
                  key={item.path}
                  as={Link}
                  to={item.path}
                  onClick={() => setIsCollapsed(false)}
                  icon={IconComponent}
                  className={`
                    py-3 px-3 rounded-xl transition-all duration-200 font-medium
                    transform hover:scale-[1.02] hover:shadow-sm
                    border-2 border-transparent
                    ${getColorClasses(item.color, isActive)}
                    ${isActive ? 'shadow-sm scale-[1.02]' : ''}
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

            {/* Reports & Analytics */}
            <SidebarItem
              href="#"
              icon={HiChartBar}
              className="py-3 px-3 rounded-xl hover:bg-cyan-50 hover:text-cyan-600 transition-all duration-200 transform hover:scale-[1.02] font-medium"
            >
              Reports & Analytics
            </SidebarItem>

            {/* Logout Button */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <SidebarItem
                onClick={() => setShowLogoutModal(true)}
                icon={HiLogout}
                className="py-3 px-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 transform hover:scale-[1.02] font-medium cursor-pointer group"
              >
                <span className="flex items-center justify-between w-full">
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
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </Button>
              <Button 
                color="failure" 
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 border border-red-600 rounded-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg"
              >
                <HiLogout className="w-4 h-4 mr-2" />
                Yes, Logout
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .sidebar-item {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        .sidebar-item:nth-child(1) { animation-delay: 0.1s; }
        .sidebar-item:nth-child(2) { animation-delay: 0.15s; }
        .sidebar-item:nth-child(3) { animation-delay: 0.2s; }
        .sidebar-item:nth-child(4) { animation-delay: 0.25s; }
        .sidebar-item:nth-child(5) { animation-delay: 0.3s; }
        .sidebar-item:nth-child(6) { animation-delay: 0.35s; }
        .sidebar-item:nth-child(7) { animation-delay: 0.4s; }
        .sidebar-item:nth-child(8) { animation-delay: 0.45s; }
        .sidebar-item:nth-child(9) { animation-delay: 0.5s; }
        .sidebar-item:nth-child(10) { animation-delay: 0.55s; }
        .sidebar-item:nth-child(11) { animation-delay: 0.6s; }
      `}</style>
    </>
  );
}

export default Sidebar;