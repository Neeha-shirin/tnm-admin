import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";

const PrivacyPolicy = () => {
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [pageId, setPageId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  // Close notification
  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  // Load saved content on component mount
  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/static-pages/`);

        const privacyPage = res.data.find(
          (page) => page.page_type === "privacy"
        );

        if (privacyPage) {
          setContent(privacyPage.content);
          setSavedContent(privacyPage.content);
          setPageId(privacyPage.id);
          setLastUpdated(
            new Date(privacyPage.last_updated).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        } else {
          setContent("<p>Enter your privacy policy content here...</p>");
        }
      } catch (error) {
        console.error("Error loading Privacy Policy:", error);
        showNotification("Failed to load Privacy Policy.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  // Create/Update
  const handleSave = async () => {
    if (
      !content.trim() ||
      content === "<p>Enter your privacy policy content here...</p>"
    ) {
      showNotification("Please enter some content before saving.", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (pageId) {
        // Update existing page
        await api.put(`/static-pages/${pageId}/`, {
          page_type: "privacy",
          content,
        });
        showNotification("Privacy Policy updated successfully!", "success");
      } else {
        // Create new page
        const res = await api.post(`/static-pages/`, {
          page_type: "privacy",
          content,
        });
        setPageId(res.data.id);
        showNotification("Privacy Policy created successfully!", "success");
      }

      setSavedContent(content);
      setIsEditing(false);
      setLastUpdated(
        new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Error saving Privacy Policy:", error);
      showNotification("Failed to save Privacy Policy.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Read
  const handleEdit = () => {
    setIsEditing(true);
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  // Close modals safely
  const closeModals = () => {
    setShowDeleteModal(false);
    setShowClearAllModal(false);
    setDeleteIndex(null);
  };

  // Delete
  const handleDelete = async () => {
    console.log("Deleting Page ID:", pageId);
    if (!pageId) {
      showNotification("Cannot delete: page ID not found.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/static-pages/${pageId}/`);
      setPageId(null);
      setContent("<p>Enter your privacy policy content here...</p>");
      setSavedContent("");
      setLastUpdated("");
      setIsEditing(false);
      showNotification("Privacy Policy deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting Privacy Policy:", error);
      showNotification("Failed to delete Privacy Policy.", "error");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    if (savedContent) {
      setContent(savedContent);
    } else {
      setContent("<p>Enter your privacy policy content here...</p>");
    }
    setIsEditing(false);
  };

  const handlePreview = () => {
    if (
      !content.trim() ||
      content === "<p>Enter your privacy policy content here...</p>"
    ) {
      showNotification("Please enter some content to preview.", "error");
      return;
    }
    setSavedContent(content);
    setIsEditing(false);
  };

  const getCharacterCount = () => {
    return savedContent.replace(/<[^>]*>/g, "").length;
  };

  return (
    <div className="">
      {/* Animated Notification Popup - Fixed Position */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div
            className={`relative bg-white shadow-2xl rounded-lg border-l-4 ${
              notification.type === "error"
                ? "border-red-500"
                : "border-emerald-500"
            } p-4 transform transition-all duration-300 animate-slide-in`}
          >
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 rounded-full p-1 ${
                  notification.type === "error"
                    ? "bg-red-100 text-red-500"
                    : "bg-emerald-100 text-emerald-500"
                }`}
              >
                {notification.type === "error" ? (
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
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
              <div className="ml-3 flex-1">
                <p
                  className={`text-sm font-medium ${
                    notification.type === "error"
                      ? "text-red-800"
                      : "text-emerald-800"
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={closeNotification}
                  className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    notification.type === "error"
                      ? "focus:ring-red-500 text-red-400 hover:text-red-500"
                      : "focus:ring-emerald-500 text-emerald-400 hover:text-emerald-500"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
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
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-xl font-bold text-black-2000 sm:text-3xl bg-gradient-to-r from-emerald-900 to-green-900 bg-clip-text text-transparent">
            Privacy Policy Management
          </h1>
          <p className="mt-2 text-sm text-emerald-700 font-medium">
            Create and manage your organization's privacy policy
          </p>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full mx-auto"></div>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-6 transform transition-all duration-300 hover:shadow-2xl border border-emerald-100">
          {/* Card Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 to-green-500 border-b border-emerald-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Privacy Policy Editor
              </h2>
              {/* <p className="text-emerald-100 mt-1 font-medium">
                {isEditing ? 'Edit your privacy policy content' : 'View your current privacy policy'}
              </p> */}
            </div>
            <div className="flex items-center gap-2">
              {savedContent && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-emerald-600 shadow-lg animate-pulse">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-bounce"></span>
                  Published
                </span>
              )}
              {!savedContent && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Draft
                </span>
              )}
            </div>
          </div>

          {/* Editor/Preview Section */}
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200 transform transition-all duration-300 hover:bg-emerald-100">
                  <span className="text-sm font-semibold text-emerald-800">
                    Editing Mode
                  </span>
                  <button
                    onClick={handlePreview}
                    className="inline-flex items-center px-4 py-2 border border-emerald-300 text-sm font-medium rounded-lg text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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

                <div className="border-2 border-emerald-200 rounded-xl overflow-hidden transform transition-all duration-300 hover:border-emerald-300">
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
              <div className="border-2 border-emerald-100 rounded-xl overflow-hidden transform transition-all duration-300 hover:border-emerald-200">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-4 border-b border-emerald-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-emerald-900">
                    Current Privacy Policy
                  </h3>
                  {savedContent && (
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Edit Policy
                    </button>
                  )}
                </div>
                <div className="p-6 min-h-[200px] bg-gradient-to-br from-white to-emerald-50">
                  {savedContent ? (
                    <div
                      className="prose max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: savedContent }}
                    />
                  ) : (
                    <div className="text-center py-12 transform transition-all duration-500 hover:scale-105">
                      <div className="text-emerald-300 mb-6 animate-float">
                        <svg
                          className="mx-auto h-16 w-16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-emerald-600 text-xl font-semibold">
                        No privacy policy created yet.
                      </p>
                      <p className="text-emerald-500 mt-2">
                        Click "Create Policy" to get started.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 to-green-50 border-t border-emerald-200">
            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
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
                        Save Policy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-3 border border-emerald-300 text-base font-medium rounded-xl text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Cancel
                  </button>
                  {savedContent && (
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      disabled={isLoading}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 ml-auto"
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
                      Delete Policy
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
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
                  {savedContent ? "Edit Policy" : "Create Policy"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        {savedContent && (
          <div className="bg-white shadow-2xl rounded-2xl p-6 transform transition-all duration-300 hover:shadow-2xl border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-6">
              Policy Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center transform transition-all duration-300 hover:scale-105">
                <div className="text-sm font-semibold text-emerald-600 mb-2">
                  Status
                </div>
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 shadow-lg">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                  Published
                </div>
              </div>
              <div className="text-center transform transition-all duration-300 hover:scale-105">
                <div className="text-sm font-semibold text-emerald-600 mb-2">
                  Last Updated
                </div>
                <div className="text-lg font-bold text-emerald-900 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200">
                  {lastUpdated}
                </div>
              </div>
              <div className="text-center transform transition-all duration-300 hover:scale-105">
                <div className="text-sm font-semibold text-emerald-600 mb-2">
                  Content Length
                </div>
                <div className="text-lg font-bold text-emerald-900 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200">
                  {getCharacterCount().toLocaleString()} characters
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200 transform transition-all duration-300 hover:shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="h-6 w-6 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-emerald-800">
                Tips for your Privacy Policy
              </h3>
              <div className="mt-3 text-emerald-700">
                <ul className="list-none space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Be clear and transparent about data collection
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Explain how user data is used and protected
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Include contact information for privacy concerns
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    Keep the policy updated with current practices
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto transform transition-all duration-300 scale-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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
                Delete Privacy Policy
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your Privacy Policy? This action
                cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations to CSS */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes slide-in {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;