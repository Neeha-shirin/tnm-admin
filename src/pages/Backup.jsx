import React, { useEffect, useState } from "react";
import api from "../api";

const Backup = () => {
  const [backups, setBackups] = useState([]);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSelectRestoreModal, setShowSelectRestoreModal] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [selectedBackups, setSelectedBackups] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch all backups
  const fetchBackups = async () => {
  setLoadingList(true);
  try {
    const res = await api.get("/backup/list/");

    const mapped = (res.data.backups || []).map((backup, i) => {
      let formattedDate = "Unknown";

      // 1️⃣ Try to extract full date-time from filename like: backup_2025-11-12_14-35-00.zip
      const match = backup.filename?.match(
        /(\d{4})-(\d{2})-(\d{2})[_-](\d{2})[-:](\d{2})[-:](\d{2})/
      );

      if (match) {
        const [_, year, month, day, hour, minute, second] = match;
        const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
        const dateObj = new Date(isoString);

        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
      }

      // 2️⃣ Fallback if backend provides created_at or modified_time
      if (formattedDate === "Unknown" && backup.created_at) {
        const dateObj = new Date(backup.created_at);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toLocaleString("en-IN", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
      }

      return {
        id: i + 1,
        name: backup.filename || "Unknown",
        date: formattedDate, // ✅ Date + Time
        size: backup.size_mb ? `${backup.size_mb.toFixed(2)} MB` : "—",
        size_mb: backup.size_mb || 0,
      };
    });

    setBackups(mapped);
  } catch (err) {
    console.error("Error fetching backups:", err);
  } finally {
    setLoadingList(false);
  }
};


  useEffect(() => {
    fetchBackups();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // ✅ Create new backup
  const handleBackup = async () => {
    setLoading(true);
    try {
      await api.post("/backup/manual/");
      await fetchBackups();
      console.log("✅ Backup created successfully");
    } catch (err) {
      console.error("Backup failed:", err);
    } finally {
      setLoading(false);
      setShowBackupModal(false);
    }
  };

  // ✅ Restore selected backup (Dynamic for existing / upload / manual)
  const handleRestore = async () => {
    if (!selectedBackup) {
      showToast("Please select a backup to restore.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    try {
      if (
        selectedBackup.type === "existing" ||
        selectedBackup.type === "manual"
      ) {
        // Restore using filename
        await api.post(
          "/backup/restore/",
          { filename: selectedBackup.name },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("✅ Restored from:", selectedBackup.name);
      } else if (selectedBackup.type === "upload" && selectedBackup.file) {
        // Restore using uploaded file
        formData.append("file", selectedBackup.file);
        await api.post("/backup/restore/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(
          "✅ Restored from uploaded file:",
          selectedBackup.file.name
        );
      } else {
        showToast("Please select a valid restore method.");
        return;
      }

      showToast("System restored successfully!");
      await fetchBackups(); // Refresh list
    } catch (err) {
      console.error("❌ Restore failed:", err);
      showToast(
        "Restore failed. Please check your backup file or permissions."
      );
    } finally {
      setLoading(false);
      setShowRestoreModal(false);
    }
  };

  // ✅ Download backup file
  const handleDownload = async (backup) => {
    try {
      const res = await api.get(`/download-backup/${backup.name}/`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = backup.name;
      link.click();
      window.URL.revokeObjectURL(url);
      setShowDownloadModal(false);
    } catch (error) {
      console.error("Download failed:", error.response || error.message);
      showToast("Download failed");
    }
  };

  // ✅ Delete selected backup
  const handleDelete = async () => {
    if (selectedBackups.length === 0) {
      showToast("Please select at least one backup to delete.", "error");
      return;
    }

    setLoading(true);
    try {
      await api.delete("/backup/delete/", { data: { files: selectedBackups } });
      showToast("Selected backups deleted successfully!");
      setSelectedBackups([]);
      await fetchBackups();
    } catch (err) {
      console.error("Delete failed:", err.response || err.message);
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type,
    loading = false,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white border border-emerald-200 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform scale-0 animate-scaleIn">
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mx-auto mb-6`}
          >
            {type === "backup" && (
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
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
            )}
            {type === "restore" && (
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            {type === "download" && (
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
            {type === "delete" && (
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v0H8a2 2 0 012-2z"
                />
              </svg>
            )}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
            {title}
          </h3>
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex-1
    ${
      type === "delete"
        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/25"
        : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25"
    }`}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <style jsx>{`
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center animate-fadeInUp">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-900 to-emerald-800 bg-clip-text text-transparent mb-4 p-5">
            Backup Management
          </h1>
          <p className="text-gray-600 text-lg">
            Secure your data with automated backup solutions
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform animate-slideUp hover:shadow-2xl transition-all duration-300">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-5 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span>Backup Files</span>
              </h2>
              <div className="flex items-center space-x-2 text-emerald-100">
                <div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse"></div>
                <span className="text-sm">System Active</span>
              </div>
            </div>
          </div>

          {/* ✅ Buttons */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-between">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowBackupModal(true)}
                  onMouseEnter={() => setIsHovered("backup")}
                  onMouseLeave={() => setIsHovered(null)}
                  className="group bg-gradient-to-r from-emerald-700 to-emerald-800 text-white px-7 py-3 rounded-2xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
                >
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-500 ${
                      isHovered === "backup" ? "rotate-12 scale-110" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span className="font-semibold">Create Backup</span>
                </button>

                <button
                  onClick={() => setShowSelectRestoreModal(true)}
                  onMouseEnter={() => setIsHovered("restore")}
                  onMouseLeave={() => setIsHovered(null)}
                  className="group border-2 border-emerald-600 text-emerald-600 px-7 py-3 rounded-2xl hover:bg-emerald-50 transition-all duration-500 transform hover:scale-105 flex items-center space-x-3"
                >
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-500 ${
                      isHovered === "restore" ? "rotate-45 scale-110" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="font-semibold">Restore System</span>
                </button>
              </div>

              <div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={selectedBackups.length === 0}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2
      ${
        selectedBackups.length === 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600"
      }`}
                >
                  Delete Selected ({selectedBackups.length})
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
         <div className="overflow-x-auto">
  {loadingList ? (
    <div className="flex justify-center items-center py-10">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-emerald-700 font-medium">
        Loading backups...
      </span>
    </div>
  ) : backups.length === 0 ? (
    <p className="text-center py-6 text-gray-500">No backups found</p>
  ) : (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            {/* ✅ Index Number Header */}
            <th className="py-6 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              #
            </th>

            <th className="py-6 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={
                  selectedBackups.length === backups.length && backups.length > 0
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBackups(backups.map((b) => b.name));
                  } else {
                    setSelectedBackups([]);
                  }
                }}
                className="accent-emerald-600"
              />
            </th>

            <th className="py-6 px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              File Name
            </th>
            <th className="py-6 px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Date Created
            </th>
            <th className="py-6 px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Size
            </th>
            <th className="py-6 px-8 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {backups
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((row, index) => (
              <tr
                key={index}
                className="hover:bg-emerald-50/50 transition-all duration-300 group"
              >
                {/* ✅ Index Number */}
                <td className="py-5 px-4 font-medium text-gray-700">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>

                {/* Checkbox */}
                <td className="py-5 px-4">
                  <input
                    type="checkbox"
                    checked={selectedBackups.includes(row.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBackups([...selectedBackups, row.name]);
                      } else {
                        setSelectedBackups(
                          selectedBackups.filter((name) => name !== row.name)
                        );
                      }
                    }}
                    className="accent-emerald-600"
                  />
                </td>

                <td className="py-5 px-8">{row.name}</td>
                <td className="py-5 px-8">{row.date}</td>
                <td className="py-5 px-8">{row.size}</td>
                <td className="py-5 px-8 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedBackup(row);
                      setShowDownloadModal(true);
                    }}
                    className="text-gray-400 hover:text-emerald-600 transition-all duration-300 p-3 rounded-xl hover:bg-emerald-50 transform hover:scale-110"
                    title="Download Backup"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ✅ Pagination Controls */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-600 text-sm">
          Page {currentPage} of {Math.ceil(backups.length / itemsPerPage)}
        </span>

        <button
          onClick={() => {
            if (currentPage < Math.ceil(backups.length / itemsPerPage)) {
              setCurrentPage(currentPage + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          disabled={currentPage === Math.ceil(backups.length / itemsPerPage)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            currentPage === Math.ceil(backups.length / itemsPerPage)
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </>
  )}
</div>

        </div>
      </div>

      {/* ✅ Select Backup Modal for Restore */}
      {showSelectRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-4xl shadow-lg animate-scaleIn">
            <h2 className="text-lg font-semibold text-emerald-600 mb-4">
              Select or Upload a Backup to Restore
            </h2>

            {/* Choose Method */}
            <div className="space-y-6 mb-6">
              {/* Option 1: Select existing backup */}
              <div className="border rounded-lg">
                <label className="flex items-center p-3 border-b bg-emerald-50 font-medium text-emerald-800">
                  <input
                    type="radio"
                    name="restoreMethod"
                    className="mr-3 accent-emerald-600"
                    checked={selectedBackup?.type === "existing"}
                    onChange={() =>
                      setSelectedBackup({ type: "existing", name: null })
                    }
                  />
                  Select from existing backups
                </label>

                {selectedBackup?.type === "existing" && (
                  <div
                    className="overflow-y-auto border-t"
                    style={{
                      maxHeight: "250px", // 👈 Adjust height (250px = ~6–7 items)
                      scrollbarWidth: "thin",
                      scrollbarColor: "#10b981 #f3f4f6",
                    }}
                  >
                    {backups.length > 0 ? (
                      backups.map((b, i) => (
                        <label
                          key={i}
                          className="flex items-center px-4 py-2 hover:bg-emerald-50 cursor-pointer border-b"
                        >
                          <input
                            type="radio"
                            name="backupFile"
                            className="mr-3 accent-emerald-600"
                            checked={selectedBackup?.name === b.name}
                            onChange={() =>
                              setSelectedBackup({
                                type: "existing",
                                name: b.name,
                              })
                            }
                          />
                          <span>{b.name}</span>
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-3">
                        No backups available
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Option 2: Upload from computer */}
              <div className="border rounded-lg">
                <label className="flex items-center p-3 border-b bg-emerald-50 font-medium text-emerald-800">
                  <input
                    type="radio"
                    name="restoreMethod"
                    className="mr-3 accent-green-600"
                    checked={selectedBackup?.type === "upload"}
                    onChange={() =>
                      setSelectedBackup({ type: "upload", file: null })
                    }
                  />
                  Upload from computer
                </label>

                {selectedBackup?.type === "upload" && (
                  <div className="p-4">
                    <input
                      type="file"
                      accept=".sql"
                      onChange={(e) =>
                        setSelectedBackup({
                          type: "upload",
                          file: e.target.files[0],
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    {selectedBackup?.file && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {selectedBackup.file.name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Option 3: Enter file name manually */}
              <div className="border rounded-lg">
                <label className="flex items-center p-3 border-b bg-emerald-50 font-medium text-emerald-800">
                  <input
                    type="radio"
                    name="restoreMethod"
                    className="mr-3 accent-emerald-600"
                    checked={selectedBackup?.type === "manual"}
                    onChange={() =>
                      setSelectedBackup({ type: "manual", name: "" })
                    }
                  />
                  Enter file name manually
                </label>

                {selectedBackup?.type === "manual" && (
                  <div className="p-4">
                    <input
                      type="text"
                      placeholder="Enter backup file name..."
                      value={selectedBackup?.name || ""}
                      onChange={(e) =>
                        setSelectedBackup({
                          type: "manual",
                          name: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSelectRestoreModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                disabled={
                  !selectedBackup ||
                  (selectedBackup.type === "existing" &&
                    !selectedBackup.name) ||
                  (selectedBackup.type === "manual" && !selectedBackup.name) ||
                  (selectedBackup.type === "upload" && !selectedBackup.file)
                }
                onClick={() => {
                  setShowSelectRestoreModal(false);
                  setShowRestoreModal(true);
                }}
                className={`px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition ${
                  !selectedBackup ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Custom Toast Notification */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white animate-fadeInUp
      ${toast.type === "error" ? "bg-red-600" : "bg-emerald-600"}`}
        >
          {toast.message}
        </div>
      )}

      {/* ✅ Modals */}
      <ConfirmationModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onConfirm={handleBackup}
        title="Create New Backup"
        message="Are you sure you want to create a new system backup? This may take several minutes."
        type="backup"
        loading={loading}
      />

      <ConfirmationModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={handleRestore}
        title="Restore System"
        message={`This will restore your system from the selected backup. This action cannot be undone.`}
        type="restore"
        loading={loading}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Backups"
        message={`Are you sure you want to permanently delete ${selectedBackups.length} backup(s)? This action cannot be undone.`}
        type="delete"
        loading={loading}
      />

      <ConfirmationModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onConfirm={() => handleDownload(selectedBackup)}
        title="Download Backup"
        message={`Do you want to download ${selectedBackup?.name}?`}
        type="backup"
        loading={loading}
      />
    </div>
  );
};

export default Backup;
