import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import Courses from "./pages/Courses";
import { UserNavbar } from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Tutor from "./pages/Tutor";
import Student from "./pages/Student";
import Assignment from "./pages/Assignment";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Payment from "./pages/Payment";
import StudentAssignTable from "./pages/StudentAssignTable";
import Testmonio from "./pages/Testmonio";
import Blog from "./pages/Blog";
import User from "./pages/User";
import Contact from "./pages/Contact";
import "./App.css";
import NotificationsPage from "./pages/NotificationsPage";
import StudentPayment from "./pages/StudentPayment";
import { useEffect, useState } from "react";
import Faq from "./pages/Faq";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Refund from "./pages/Refund";
import Terms from "./pages/Terms";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Unauthorized from "./pages/Unauthorized";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/ScrollToTop";
import Backup from "./pages/Backup";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Prevent caching protected routes
    window.history.scrollRestoration = "manual";
    window.onpopstate = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.replace("/login");
      }
    };
  }, [location]);

  // Check if current route is login
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/unauthorized" ||
    location.pathname === "/404" ||
    ![
      "/",
      "/course",
      "/reviews",
      "/tutor",
      "/student",
      "/testmonio",
      "/blog",
      "/studentassign",
      "/assignment",
      "/messages",
      "/contact",
      "/faq",
      "/privacy",
      "/refund",
      "/terms",
      "/user",
      "/payment",
      "/studentpayment",
      "/backup",
    ].includes(location.pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <ScrollToTop />
      {/* Show navbar only if not on login page */}
      {!hideLayout && (
        <UserNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      )}

      <div className="flex flex-1 h-[1000px]">
        {/* Show sidebar only if not on login page */}
        {!hideLayout && (
          <div className="lg:w-64 bg-white shadow-md border-r">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Page content */}
        {/* <div className="flex-1 p-6 bg-gray-100 overflow-y-auto scrollbar-hide"></div> */}
        <div className="flex-1 p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-y-auto scrollbar-hide">
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin-only */}
            <Route
              path="/user"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <User />
                </RoleBasedRoute>
              }
            />

            {/* Financier-only */}
            <Route
              path="/payment"
              element={
                <RoleBasedRoute allowedRoles={["financier", "admin"]}>
                  <Payment />
                </RoleBasedRoute>
              }
            />

            {/* Monitor-only */}
            <Route
              path="/studentpayment"
              element={
                <RoleBasedRoute allowedRoles={["financier", "admin"]}>
                  <StudentPayment />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/tutor"
              element={
                <RoleBasedRoute allowedRoles={["monitor", "admin"]}>
                  <Tutor />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/course"
              element={
                <RoleBasedRoute allowedRoles={["monitor", "admin"]}>
                  <Courses />
                </RoleBasedRoute>
              }
            />
            

            <Route
              path="/student"
              element={
                <RoleBasedRoute allowedRoles={["monitor", "admin"]}>
                  <Student />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/testmonio"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Testmonio />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Blog />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/studentassign"
              element={
                <RoleBasedRoute allowedRoles={["monitor", "admin"]}>
                  <StudentAssignTable />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/assignment"
              element={
                <RoleBasedRoute allowedRoles={["monitor", "admin"]}>
                  <Assignment />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <RoleBasedRoute
                  allowedRoles={["monitor", "admin", "financier"]}
                >
                  <NotificationsPage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Contact />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/faq"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Faq />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/privacy"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <PrivacyPolicy />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/refund"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Refund />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/terms"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Terms />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/backup"
              element={
                <RoleBasedRoute allowedRoles={["admin"]}>
                  <Backup />
                </RoleBasedRoute>
              }
            />

            {/* General protected pages */}
            <Route
              path="/"
              element={
                <RoleBasedRoute allowedRoles={["financier", "admin","monitor"]}>
                  <Dashboard />
                </RoleBasedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}