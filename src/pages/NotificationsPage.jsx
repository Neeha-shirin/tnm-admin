import React, { useEffect, useState } from "react";
import { HiBell, HiCheckCircle, HiXCircle, HiInformationCircle, HiTrash, HiRefresh } from "react-icons/hi";
import api from "../api";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch notifications from API
 const fetchNotifications = async (isRefresh = false) => {
  if (isRefresh) setRefreshing(true);

  try {
    const res = await api.get("/notify/");
    
    // 👇 ADD THIS HERE
    console.log("Fetched notifications:", res.data);

    if (Array.isArray(res.data)) {
      // ✅ Sort notifications by time (newest first)
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
      setNotifications(sorted);
    } else {
      setNotifications([]);
    }
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    setNotifications([]);
  } finally {
    setLoading(false);
    if (isRefresh) setRefreshing(false);
  }
};



  useEffect(() => {
    fetchNotifications();
  }, []);

  // Delete a notification
  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await api.delete(`/notify-delete/${id}/`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    
    try {
      // If your API supports bulk delete, use that instead
      const deletePromises = notifications.map(notif => 
        api.delete(`/notify-delete/${notif.id}/`)
      );
      await Promise.all(deletePromises);
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear all notifications:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <HiCheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <HiXCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <HiInformationCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <HiBell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case "success":
        return "border-l-4 border-l-green-500 bg-green-50";
      case "error":
        return "border-l-4 border-l-red-500 bg-red-50";
      case "info":
        return "border-l-4 border-l-blue-500 bg-blue-50";
      default:
        return "border-l-4 border-l-gray-500 bg-gray-50";
    }
  };

  // Format relative time
  // Format relative time
const formatTime = (timeString) => {
  if (!timeString) return "";

  // Convert "06-11-2025 02:26 PM" → Date object
  const [datePart, timePart, meridian] = timeString.split(" ");
  const [day, month, year] = datePart.split("-");
  let [hours, minutes] = timePart.split(":");

  // Convert 12-hour to 24-hour format
  hours = parseInt(hours);
  if (meridian === "PM" && hours < 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  const parsedDate = new Date(`${year}-${month}-${day}T${String(hours).padStart(2, "0")}:${minutes}:00`);

  if (isNaN(parsedDate.getTime())) return ""; // fallback if parsing fails

  const now = new Date();
  const diffInSeconds = Math.floor((now - parsedDate) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: parsedDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};



  return (
    <div className="">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="relative">
              <HiBell className="h-8 w-8 text-green-700 mr-3" />
              
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-sm text-gray-600 mt-1">Stay updated with your latest activities</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <HiRefresh className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200"
              >
                <HiTrash className="h-4 w-4 mr-2" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-3">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-5 transition-all duration-200 hover:shadow-sm ${getNotificationStyle(notif.type)}`}
                >
                  <div className="flex items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0 mr-4 mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-500 font-medium">
                          {formatTime(notif.created_at)}

                        </span>
                        {notif.category && (
                          <>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {notif.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      disabled={deleteLoading === notif.id}
                      className="ml-4 flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 disabled:opacity-50 p-1 rounded-full hover:bg-red-50"
                      aria-label="Delete notification"
                    >
                      {deleteLoading === notif.id ? (
                        <div className="h-4 w-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                      ) : (
                        <HiTrash className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <HiBell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You're all caught up! New notifications will appear here when available.
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;