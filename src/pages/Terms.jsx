import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";

const TermsAndConditions = () => {
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [pageId, setPageId] = useState(null);
  const editorRef = useRef(null);

  // Enhanced notification system
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(closeNotification, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Load from localStorage on mount
  useEffect(() => {
    const fetchTerms = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/static-pages/`);

        const termsPage = res.data.find((page) => page.page_type === "terms");

        if (termsPage) {
          setContent(termsPage.content);
          setSavedContent(termsPage.content);
          setPageId(termsPage.id);
          setLastUpdated(
            new Date(termsPage.last_updated).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        } else {
          setContent(
            `<p>Enter your comprehensive terms and conditions here. Include details about user agreements, privacy policies, usage guidelines, and legal information.</p>`
          );
        }
      } catch (error) {
        console.error("Error loading Terms & Conditions:", error);
        showNotification("Failed to load Terms & Conditions.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  // Enhanced save handler
 const handleSave = async () => {
  setIsLoading(true);
  try {
    if (pageId) {
      // Update existing terms
      const response = await api.put(`/static-pages/${pageId}/`, {
        page_type: "terms",
        content,
      });
      setSavedContent(response.data.content);
      setNotification("Terms & Conditions updated successfully!");
    } else {
      // Create new terms page automatically
      const response = await api.post("/static-pages/", {
        page_type: "terms",
        content,
      });
      setPageId(response.data.id);
      setSavedContent(response.data.content);
      setNotification("Terms & Conditions created successfully!");
    }

    setIsEditing(false);
  } catch (error) {
    console.error("Error saving Terms & Conditions:", error);
    alert("An error occurred while saving. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  // Enhanced actions
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handlePreview = () => {
    if (
      !content ||
      !content.trim() ||
      content ===
        "<p>Enter your comprehensive terms and conditions here. Include details about user agreements, privacy policies, usage guidelines, and legal information.</p>"
    ) {
      showNotification("Please enter content to preview.", "error");
      return;
    }
    setSavedContent(content);
    setIsEditing(false);
    showNotification("Preview mode activated", "info");
  };

  // Delete handlers
  const handleDeleteClick = () => {
    if (!savedContent) return;
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      let page = pageId;

      // ✅ If we don't already have the page ID, fetch it using page_type
      if (!pageId) {
        const res = await api.get("/static-pages/?page_type=terms");
        if (res.data && res.data.length > 0) {
          page = res.data[0].id;
          setPageId(page);
        }
      }

      // ✅ If we have a valid page, delete it via API
      if (page) {
        await api.delete(`/static-pages/${page}/`);
        showNotification(
          "Terms and conditions deleted successfully!",
          "warning"
        );
      } else {
        showNotification("No Terms & Conditions found to delete.", "error");
      }

      // ✅ Reset frontend state after delete
      const defaultContent =
        "<p>Enter your comprehensive terms and conditions here. Include details about user agreements, privacy policies, usage guidelines, and legal information.</p>";
      setContent(defaultContent);
      setSavedContent("");
      setLastUpdated("");
      setIsEditing(false);
      setShowDeletePopup(false);
      setPageId(null);
    } catch (error) {
      console.error("Error deleting Terms & Conditions:", error);
      showNotification("Failed to delete Terms & Conditions.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
  };

  const handleCancel = () => {
    if (savedContent) {
      setContent(savedContent);
    } else {
      setContent(
        "<p>Enter your comprehensive terms and conditions here. Include details about user agreements, privacy policies, usage guidelines, and legal information.</p>"
      );
    }
    setIsEditing(false);
    showNotification("Changes discarded", "info");
  };

  const getWordCount = (html) => {
    const text = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text ? text.split(" ").length : 0;
  };

  return (
    <div className="">
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-600"
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
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Terms & Conditions
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the terms and conditions? This
                action cannot be undone and all your current terms will be
                permanently removed.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 transition-colors duration-200"
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Notification */}
      {notification.show && (
        <div
          className={`fixed top-5 right-5 z-40 transition-all duration-500 transform ${
            notification.show
              ? "translate-x-0 opacity-100 scale-100"
              : "translate-x-full opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div
            className={`max-w-sm w-full bg-white rounded-xl shadow-2xl px-6 py-4 border-l-4 ${
              notification.type === "error"
                ? "border-red-500 bg-red-50"
                : notification.type === "warning"
                ? "border-amber-500 bg-amber-50"
                : notification.type === "info"
                ? "border-blue-500 bg-blue-50"
                : "border-emerald-500 bg-emerald-50"
            } relative overflow-hidden`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-full ${
                  notification.type === "error"
                    ? "bg-red-100 text-red-600"
                    : notification.type === "warning"
                    ? "bg-amber-100 text-amber-600"
                    : notification.type === "info"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {notification.type === "error" ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : notification.type === "warning" ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : notification.type === "info" ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    notification.type === "error"
                      ? "text-red-800"
                      : notification.type === "warning"
                      ? "text-amber-800"
                      : notification.type === "info"
                      ? "text-blue-800"
                      : "text-emerald-800"
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={closeNotification}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded-full"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {/* Progress bar */}
            <div
              className={`absolute bottom-0 left-0 h-1 w-full transform origin-left transition-transform duration-4000 ${
                notification.show ? "scale-x-100" : "scale-x-0"
              } ${
                notification.type === "error"
                  ? "bg-red-500"
                  : notification.type === "warning"
                  ? "bg-amber-500"
                  : notification.type === "info"
                  ? "bg-blue-500"
                  : "bg-emerald-500"
              }`}
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        {/* Enhanced Header */}
        <header className="text-center mb-12">
          <div className="relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-200 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-100 rounded-full translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-emerald-900 mb-4 tracking-tight">
                Terms & Conditions Management
              </h1>

              <p className="text-lg text-emerald-600 max-w-2xl mx-auto mb-6">
                Create and manage your legal terms and conditions to ensure
                compliance and protect your business
              </p>

              {lastUpdated && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 backdrop-blur-sm rounded-full text-emerald-800 text-sm">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Last updated:{" "}
                  <span className="font-semibold">{lastUpdated}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Enhanced Main Card */}
        <main className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 transition-all duration-300 hover:shadow-2xl">
          <div className="p-8">
            {/* Enhanced Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-2xl">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Terms & Conditions
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage your legal terms and user agreements
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Edit Terms
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-60 disabled:transform-none shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            ></path>
                          </svg>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Publish Changes
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="inline-flex items-center px-5 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancel
                    </button>

                    <button
                      onClick={handlePreview}
                      disabled={isLoading}
                      className="inline-flex items-center px-5 py-3 rounded-xl bg-amber-100 text-amber-800 font-medium hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Preview
                    </button>
                  </div>
                )}

                {savedContent && (
                  <button
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className="inline-flex items-center px-5 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-60 disabled:transform-none"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>

            {/* Stats Bar */}
            {isEditing && (
              <div className="flex flex-wrap items-center gap-6 p-4 bg-emerald-50 rounded-xl mb-6 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      Word Count
                    </p>
                    <p className="text-lg font-bold text-emerald-800">
                      {getWordCount(content)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-600">
                      Status
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      Editing
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Editor / Viewer Container */}
            <div className="border border-emerald-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-300">
              {isEditing ? (
                <div className="p-6 bg-white border-b border-emerald-100">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-emerald-700 mb-2">
                      Terms & Conditions Editor
                    </label>
                    <p className="text-sm text-emerald-500">
                      Use the toolbar to format your terms and conditions.
                      Include all necessary legal details for your users.
                    </p>
                  </div>
                  <div className="border border-emerald-200 rounded-xl overflow-hidden shadow-sm">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={(value) => setContent(value)}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, 4, 5, 6, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ script: "sub" }, { script: "super" }],
                          [{ color: [] }, { background: [] }],
                          [{ font: [] }],
                          [{ size: ["small", false, "large", "huge"] }],
                          [{ align: [] }],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ indent: "-1" }, { indent: "+1" }],
                          ["blockquote", "code-block"],
                          ["link", "image", "video"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "script",
                        "color",
                        "background",
                        "align",
                        "list",
                        "bullet",
                        "indent",
                        "blockquote",
                        "code-block",
                        "link",
                        "image",
                        "video",
                      ]}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-gradient-to-br from-emerald-50 to-green-50 min-h-[400px]">
                  {savedContent ? (
                    <div className="max-w-none">
                      <div className="prose prose-lg max-w-none">
                        <div
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: savedContent }}
                        />
                      </div>
                      <div className="mt-8 pt-6 border-t border-emerald-200">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-sm text-emerald-600">
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
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            These terms and conditions are legally binding for
                            your organization.
                          </div>
                          <button
                            onClick={handleEdit}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
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
                            Edit Terms
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="max-w-md mx-auto">
                        <div className="p-4 bg-emerald-100 rounded-2xl inline-flex mb-6">
                          <svg
                            className="w-8 h-8 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No Terms & Conditions Created
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Create comprehensive terms and conditions to protect
                          your business and inform your users about their rights
                          and responsibilities.
                        </p>
                        <button
                          onClick={handleEdit}
                          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Create Your First Terms
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Enhanced CKEditor Styles */}
      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 350px;
          padding: 1.5rem;
          font-size: 1rem;
          line-height: 1.6;
        }

        .ck.ck-editor {
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .ck.ck-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 0.75rem 1rem;
        }

        .ck.ck-toolbar .ck-toolbar__separator {
          background-color: #d1d5db;
        }

        .ck.ck-button:not(.ck-disabled):hover,
        .ck.ck-button.ck-on {
          background: #e5e7eb;
          border-radius: 0.375rem;
        }

        .ck.ck-dropdown__panel {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditions;