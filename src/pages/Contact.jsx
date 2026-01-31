import React, { useEffect, useState } from "react";
import api from "../api";

const Contact = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch data from API
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/contact-messages/");
      setEnquiries(response.data);
      setFiltered(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  };

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

  // Open confirmation modal
  const openDeleteConfirmation = (msg) => {
    setSelectedMessage(msg);
    setShowConfirmModal(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedMessage) return;

    try {
      setDeletingId(selectedMessage.id);
      await api.delete(`/admin/contact-messages/${selectedMessage.id}/delete/`);
      
      // Remove from state
      const updatedEnquiries = enquiries.filter((msg) => msg.id !== selectedMessage.id);
      setEnquiries(updatedEnquiries);
      
      // Close modal
      setShowConfirmModal(false);
      setSelectedMessage(null);
      
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete message. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowConfirmModal(false);
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading contact messages...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

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
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {msg.name}
                  </h3>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Delete Icon Button */}
                <button
                  onClick={() => openDeleteConfirmation(msg)}
                  disabled={deletingId === msg.id}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Delete message"
                >
                  {deletingId === msg.id ? (
                    <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
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

      {/* Confirmation Modal */}
{showConfirmModal && selectedMessage && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/40 z-40"
      onClick={closeModal}
    />

    {/* Small Modal */}
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Delete message?
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-5">
          This message from{" "}
          <span className="font-medium">{selectedMessage.name}</span> will be permanently removed.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={closeModal}
            disabled={deletingId}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmDelete}
            disabled={deletingId}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center"
          >
            {deletingId ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Deleting
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  </>
)}

    </div>
  );
};

export default Contact;