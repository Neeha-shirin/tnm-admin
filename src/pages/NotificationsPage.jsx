import React, { useEffect, useState } from "react";
import { HiBell, HiCheckCircle, HiXCircle } from "react-icons/hi";
import api from "../api";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notify/");
        console.log("Fetched notifications:", res.data);
        if (Array.isArray(res.data)) {
          // ✅ Show latest notifications first
          setNotifications(res.data.reverse());
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Delete a notification
  const handleDelete = async (id) => {
    try {
      await api.delete(`/notify-delete/${id}/`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <HiBell className="h-8 w-8 text-green-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading...</div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start p-4 hover:bg-gray-50 transition"
              >
                {/* Icon */}
                <div className="flex-shrink-0 mr-3 mt-1">
                  {notif.type === "success" && (
                    <HiCheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  {notif.type === "error" && (
                    <HiXCircle className="h-6 w-6 text-red-500" />
                  )}
                  {notif.type === "info" && (
                    <HiBell className="h-6 w-6 text-blue-500" />
                  )}
                </div>

                {/* Message */}
                <div className="flex-1">
                  <p className="text-gray-700">{notif.message}</p>
                  <span className="text-xs text-gray-400">{notif.time}</span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="ml-2 text-red-600 font-bold hover:text-red-700 transition"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400">
              No notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
