import React, { useState, useEffect } from "react";
import UserCard from "../components/Card/UserCard";
import MonthlyRevenueCard from "../components/Revenue/MonthlyRevenueCard";
import { 
  FaGraduationCap, 
  FaUserGraduate, 
  FaUserPlus, 
  FaTimes, 
  FaBell, 
  FaChartLine 
} from "react-icons/fa";
import api from "../api";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
  const [pendingTutors, setPendingTutors] = useState([]);
  const [notifications, setNotifications] = useState([]); // ✅ now dynamic
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchTutors();
    fetchPayments(); // ✅ load payment notifications dynamically
  }, []);

  // ✅ Fetch students
  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/students/");
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error fetching student count:", err);
    }
  };

  // ✅ Fetch tutors
  const fetchTutors = async () => {
    try {
      const allTutorRes = await api.get("/admin/tutors/");
      const allTutors = allTutorRes.data || [];

      setPendingTutors(allTutors.filter((t) => !t.is_approved && !t.is_rejected));

      const approvedRes = await api.get("/admin/tutors/approved/");
      setApprovedTutors(approvedRes.data || []);
    } catch (err) {
      console.error("Error fetching tutor count:", err);
    }
  };

  // ✅ Fetch Payments (for notifications)
 const fetchPayments = async () => {
  try {
    setLoading(true);
    const res = await api.get("/histories/");
    const data = res.data.histories || [];
    console.log("Sample payment data:", data[0]);


    const activePayments = data.filter(
      (item) => item.is_deleted === false || item.is_deleted === undefined
    );

    const formatted = activePayments.map((item) => {
  const tutorName = item.tutor_name || item.tutor?.full_name || "Unknown Tutor";
  const plan = item.plan_name || item.plan || "N/A";
  const amount = item.amount || item.price || 0;
  const status = item.status || "pending";

  // ✅ Format the date (fallback to today if missing)
  // ✅ Correctly parse "01-11-2025 14:14" (DD-MM-YYYY HH:mm)
let dateString = item.created_at || "";
let formattedDate = "";

if (dateString.includes("-") && dateString.includes(" ")) {
  const [day, month, rest] = dateString.split("-");
  const [year, time] = rest.split(" ");
  const parsed = new Date(`${year}-${month}-${day}T${time}:00`);
  formattedDate = parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
} else {
  formattedDate = new Date(Date.now()).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}


  return {
  id: item.id,
  message:
    status === "paid"
      ? `💰 ${tutorName} paid ₹${amount} for ${plan}`
      : `🕓 ${tutorName} has a payment for ${plan}`,
  color:
    status === "paid"
      ? "bg-green-100 border-green-400 text-green-700"
      : "bg-yellow-100 border-yellow-400 text-yellow-700",
  date: formattedDate, // ✅ use formattedDate
  created_at: item.created_at || Date.now(),
};

});


    
    const sorted = formatted.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(sorted); // ✅ Show latest 6 first

  } catch (err) {
    console.error("Error fetching payments:", err);
  } finally {
    setLoading(false);
  }
};


 // ✅ Outside of fetchPayments, define the correct API-aware remover
const removeNotification = async (id) => {
  try {
    await api.post(`/history-toggleview/${id}/`); // call backend toggle API

    // remove from UI instantly
    setNotifications((prev) => prev.filter((note) => note.id !== id));
  } catch (err) {
    console.error("Error deleting notification:", err);
  }
};


  return (
    <div className="">
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column - Stats Cards */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UserCard icon={<FaGraduationCap />} title="Total Tutors" value={approvedTutors.length} />
              <UserCard icon={<FaUserGraduate />} title="Total Students" value={students.length} />
             
            </div>

            {/* Revenue Chart Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <FaChartLine className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Monthly Revenue</h2>
                    <p className="text-gray-500 text-sm">Revenue growth over time</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <MonthlyRevenueCard />
              </div>
            </div>
          </div>

          {/* ✅ Right Column - Dynamic Notifications */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FaBell className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                      <p className="text-gray-500 text-sm">Recent payments & updates</p>
                    </div>
                  </div>
                  {notifications.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 rounded-lg">
                  {loading ? (
                    <p className="text-center text-gray-500">Loading notifications...</p>
                  ) : notifications.length > 0 ? (
                    notifications.map((note) => (
                      <div
                        key={note.id}
                        className={`flex justify-between items-start p-4 rounded-xl border-l-4 ${note.color} transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
                      >
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">{note.message}</span>
                          <p className="text-gray-500 text-sm mt-1">{note.date}</p>

                        </div>
                        <button
                          onClick={() => removeNotification(note.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-3 p-1 hover:bg-red-50 rounded-lg"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-300 mb-2">
                        <FaBell className="text-4xl mx-auto" />
                      </div>
                      <p className="text-gray-500 font-medium">No new notifications</p>
                      <p className="text-gray-400 text-sm">You're all caught up!</p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setNotifications([])}
                      className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Approval Rate</span>
                  <span className="font-semibold text-gray-900">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Rating</span>
                  <span className="font-semibold text-gray-900">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
