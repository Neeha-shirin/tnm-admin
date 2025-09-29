// Messages.jsx
"use client";
import React from "react";

function Messages() {
  const messages = [
    {
      id: 1,
      name: "John Doe",
      message: "Hey! Can we reschedule?",
      time: "2m ago",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      name: "Sarah Smith",
      message: "Payment confirmed.",
      time: "15m ago",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
    {
      id: 3,
      name: "Michael Lee",
      message: "New course uploaded!",
      time: "1h ago",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 4,
      name: "Anna White",
      message: "Thanks for the update!",
      time: "2h ago",
      avatar: "https://i.pravatar.cc/40?img=4",
    },

    {
      id: 5,
      name: "Anna White",
      message: "Thanks for the update!",
      time: "2h ago",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-md ">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Recent Messages</h2>
        <a href="#" className="text-blue-500 text-sm hover:underline">
          View All
        </a>
      </div>

      {/* Message List */}
      <div className="max-h-72 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition"
          >
            <img
              src={msg.avatar}
              alt={msg.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">{msg.name}</p>
              <p className="text-sm text-gray-500 truncate">{msg.message}</p>
            </div>
            <span className="text-xs text-gray-400">{msg.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
