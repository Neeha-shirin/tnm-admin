import React, { useEffect, useState } from "react";
import api from "../api"; // adjust the path if needed (e.g., "@/api" or "../../api")

const Contact = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/admin/contact-messages/");
        setEnquiries(response.data);
        setFiltered(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load contact messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Filter when search changes
  useEffect(() => {
    const results = enquiries.filter(
      (msg) =>
        msg.name.toLowerCase().includes(search.toLowerCase()) ||
        msg.email.toLowerCase().includes(search.toLowerCase()) ||
        msg.phone.toLowerCase().includes(search.toLowerCase()) ||
        msg.message.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, enquiries]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading contact messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">User Enquiries</h2>
        <input
          type="text"
          placeholder="Search enquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg mt-3 sm:mt-0 w-full sm:w-72"
        />
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {msg.name}
                </h3>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{msg.email}</p>
              <p className="text-sm text-gray-600 mb-2">📞 {msg.phone}</p>

              <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10 border rounded-xl bg-gray-50">
          No enquiries found.
        </div>
      )}
    </div>
  );
};

export default Contact;
