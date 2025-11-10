import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api";

const Refund = () => {
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

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  // Load saved content on component mount
  useEffect(() => {
    const fetchRefundPolicy = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/static-pages/`);
        const refundPage = res.data.find(
          (page) => page.page_type === "refund"
        );

        if (refundPage) {
          setContent(refundPage.content);
          setSavedContent(refundPage.content);
          setPageId(refundPage.id);
          setLastUpdated(
            new Date(refundPage.last_updated).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })
          );
        } else {
          setContent("<p>Enter your refund policy content here...</p>");
        }
      } catch (error) {
        console.error("Error loading Refund Policy:", error);
        showNotification("Failed to load Refund Policy.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRefundPolicy();
  }, []);

  // Create/Update
  const handleSave = async () => {
    if (!content.trim() || content === "<p>Enter your refund policy content here...</p>") {
      showNotification("Please enter some content before saving.", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (pageId) {
        await api.put(`/static-pages/${pageId}/`, {
          page_type: "refund",
          content,
        });
        showNotification("Refund Policy updated successfully!", "success");
      } else {
        const res = await api.post(`/static-pages/`, {
          page_type: "refund",
          content,
        });
        setPageId(res.data.id);
        showNotification("Refund Policy created successfully!", "success");
      }

      setSavedContent(content);
      setIsEditing(false);
      setLastUpdated(new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }));
    } catch (error) {
      console.error("Error saving Refund Policy:", error);
      showNotification("Failed to save Refund Policy.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!pageId) {
      showNotification("Cannot delete: page ID not found.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/static-pages/${pageId}/`);
      setPageId(null);
      setContent("<p>Enter your refund policy content here...</p>");
      setSavedContent("");
      setLastUpdated("");
      setIsEditing(false);
      showNotification("Refund Policy deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting Refund Policy:", error);
      showNotification("Failed to delete Refund Policy.", "error");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    setContent(savedContent);
    setIsEditing(false);
  };

  return (
    <div className="">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg border-l-4 transform transition-all duration-300 ${
          notification.type === "error" 
            ? "bg-red-50 border-red-500 text-red-700"
            : notification.type === "warning"
            ? "bg-amber-50 border-amber-500 text-amber-700"
            : "bg-emerald-50 border-emerald-500 text-emerald-700"
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === "success" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === "error" && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and customize your refund policy to ensure transparency and build customer trust
          </p>
          {lastUpdated && (
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100 mt-4">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Last updated: {lastUpdated}
              </span>
            </div>
          )}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Policy Content
              </h2>
              {!isEditing && savedContent && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Published
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {savedContent ? "Edit Policy" : "Create Policy"}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
              
              {savedContent && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isLoading}
                  className="inline-flex items-center px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Policy
                </button>
              )}
            </div>
          </div>

          {/* Editor/Viewer Content */}
          <div className="p-8">
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Policy Content
                  </label>
                  <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
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
                  <div className="flex items-start space-x-2 mt-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-emerald-800">
                      <span className="font-medium">Tip:</span> Include eligibility criteria, timeframes, refund process, and contact information for a comprehensive policy.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {savedContent ? (
                  <div className="prose prose-lg max-w-none">
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: savedContent }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      No Refund Policy Created
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Create a comprehensive refund policy to inform customers about your refund procedures and build trust.
                    </p>
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Your First Policy
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Legal Compliance</h4>
            <p className="text-sm text-gray-600">Ensure your policy meets local consumer protection laws and regulations.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Customer Trust</h4>
            <p className="text-sm text-gray-600">Clear refund policies build confidence and reduce customer service inquiries.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
            <p className="text-sm text-gray-600">Include timeframes, eligibility criteria, and contact information for clarity.</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Delete Refund Policy
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                This will permanently remove your refund policy. Customers will no longer be able to view it, and this action cannot be undone.
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200 disabled:opacity-50 flex-1"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete Policy"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Refund;