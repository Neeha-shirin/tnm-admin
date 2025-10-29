import React, { useState, useEffect } from "react";
import api from "../api";

const AdminFaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  

  // ✅ Fetch FAQs from API
  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/faq/`);
      setFaqs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch FAQs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Save FAQs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("adminFaqs", JSON.stringify(faqs));
  }, [faqs]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({ ...newFaq, [name]: value });
  };

  // ✅ Add or update FAQ
  const addFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    try {
      setIsLoading(true);
      if (editIndex !== null) {
        // Update
        const faqToEdit = faqs[editIndex];
        await api.put(`/faq/${faqToEdit.id}/`, newFaq);
      } else {
        // Create
        await api.post(`/faq/`, newFaq);
      }
      setNewFaq({ question: "", answer: "" });
      setEditIndex(null);
      fetchFaqs();
    } catch (err) {
      console.error("Error saving FAQ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit an FAQ
  const editFaq = (index) => {
    setNewFaq(faqs[index]);
    setEditIndex(index);
    // Scroll to form
    document.getElementById("faq-form").scrollIntoView({ behavior: "smooth" });
  };

  // Show delete confirmation modal
  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  // Execute delete after confirmation
  const executeDelete = async () => {
    if (deleteIndex === null) return;
    try {
      const faqToDelete = faqs[deleteIndex];
      await api.delete(`/faq/${faqToDelete.id}/`);
      setFaqs(faqs.filter((_, i) => i !== deleteIndex));
      if (activeIndex === deleteIndex) setActiveIndex(null);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setShowDeleteModal(false);
      setDeleteIndex(null);
    }
  };

  // Show clear all confirmation modal
  const confirmClearAll = () => {
    if (faqs.length > 0) setShowClearAllModal(true);
  };

  // Execute clear all after confirmation
  // ✅ Clear all FAQs
  const executeClearAll = async () => {
    try {
      setIsLoading(true);
      await Promise.all(
        faqs.map((f) => api.delete(`/faq/${f.id}/`))
      );
      setFaqs([]);
      setActiveIndex(null);
    } catch (err) {
      console.error("Clear all failed:", err);
    } finally {
      setShowClearAllModal(false);
      setIsLoading(false);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setNewFaq({ question: "", answer: "" });
    setEditIndex(null);
  };

  // Toggle FAQ visibility
  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close modals
  const closeModals = () => {
    setShowDeleteModal(false);
    setShowClearAllModal(false);
    setDeleteIndex(null);
  };

  return (
    <div className="">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto transform animate-scaleIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Delete FAQ
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this FAQ? This action cannot be
                undone.
              </p>
              {deleteIndex !== null && faqs[deleteIndex] && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium text-sm">
                    {faqs[deleteIndex].question}
                  </p>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium flex-1 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto transform animate-scaleIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Clear All FAQs
              </h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete all {faqs.length} FAQs. This action
                cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-medium text-sm text-center">
                  You're about to delete {faqs.length} question
                  {faqs.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={closeModals}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={executeClearAll}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium flex-1 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            FAQ Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your frequently asked questions with ease
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex-1 w-full relative">
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
            {faqs.length > 0 && (
              <button
                onClick={confirmClearAll}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Form to add/edit FAQ */}
        <div
          id="faq-form"
          className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-200/60"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            {editIndex !== null ? (
              <>
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit FAQ
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New FAQ
              </>
            )}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                name="question"
                placeholder="What would you like to know?"
                value={newFaq.question}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                name="answer"
                placeholder="Provide a clear and helpful answer..."
                value={newFaq.answer}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={addFaq}
                disabled={!newFaq.question.trim() || !newFaq.answer.trim()}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl green:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {editIndex !== null ? "Update FAQ" : "Add FAQ"}
              </button>
              {editIndex !== null && (
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List of FAQs */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your FAQs...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border-2 border-dashed border-gray-300">
              {faqs.length === 0 ? (
                <>
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-12 h-12 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    No FAQs Yet
                  </h3>
                  <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                    Start building your knowledge base by adding your first
                    frequently asked question.
                  </p>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4"></div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    No Results Found
                  </h3>
                  <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                    We couldn't find any FAQs matching "
                    <span className="text-gray-700 font-medium">
                      {searchTerm}
                    </span>
                    ". Try different keywords.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium"
                  >
                    Clear Search
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Frequently Asked Questions ({filteredFaqs.length})
                </h3>
                <div className="text-sm text-gray-500">
                  Click on questions to expand
                </div>
              </div>

              {filteredFaqs.map((faq, index) => {
                const originalIndex = faqs.findIndex((f) => f.id === faq.id);
                return (
                  <div
                    key={faq.id || index}
                    className="bg-white rounded-xl border border-gray-200/80 transition-all duration-300 hover:border-blue-200 hover:shadow-md"
                  >
                    <button
                      className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group"
                      onClick={() => toggleQuestion(originalIndex)}
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 transition-colors ${
                            activeIndex === originalIndex
                              ? "bg-blue-500"
                              : "bg-blue-100 group-hover:bg-blue-200"
                          }`}
                        >
                          <span
                            className={`text-sm font-semibold ${
                              activeIndex === originalIndex
                                ? "text-white"
                                : "text-blue-600"
                            }`}
                          >
                            Q
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-800 text-left group-hover:text-blue-600 transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editFaq(originalIndex);
                            }}
                            className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium border border-yellow-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(originalIndex);
                            }}
                            className="px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                          >
                            Delete
                          </button>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 group-hover:text-blue-500 ${
                            activeIndex === originalIndex
                              ? "rotate-180 text-blue-500"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>
                    {activeIndex === originalIndex && (
                      <div className="px-6 pb-5 pt-2 border-t border-gray-100 animate-fadeIn">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                            <span className="text-green-600 font-semibold text-sm">
                              A
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 leading-relaxed pt-1 whitespace-pre-wrap">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Info */}
        {faqs.length > 0 && filteredFaqs.length > 0 && (
          <div className="text-center mt-8 pt-6 border-t border-gray-200/60">
            <p className="text-gray-500">
              Showing {filteredFaqs.length} of {faqs.length} FAQs
            </p>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminFaqPage;