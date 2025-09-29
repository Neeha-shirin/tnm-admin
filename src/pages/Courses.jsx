import { useEffect, useState } from "react";
import * as XLSX from "xlsx"; 
import api from "../api"; 


// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : 
                 type === "error" ? "bg-red-500" : 
                 type === "warning" ? "bg-yellow-500" : "bg-blue-500";

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-in-out 
                    animate-in slide-in-from-right-full fade-in`}>
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}>
        {type === "success" && <span>✅</span>}
        {type === "error" && <span>❌</span>}
        {type === "warning" && <span>⚠️</span>}
        {type === "info" && <span>ℹ️</span>}
        <p>{message}</p>
      </div>
    </div>
  );
};

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 animate-in fade-in-90 slide-in-from-bottom-10">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 text-center mb-2">{title}</h3>
          <p className="text-gray-500 text-center mb-6">{message}</p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Course() {
  const [categories, setCategories] = useState([]);
  const [rootName, setRootName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set()); 
  const [deleteMode, setDeleteMode] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Delete",
    cancelText: "Cancel"
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Show confirmation modal
  const showConfirmation = (config) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  // Add a new toast
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    return id;
  };

  // Remove a toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const normalizeCategories = (cats) =>
    cats.map((cat) => ({
      ...cat,
      subcategories: cat.subcategories
        ? normalizeCategories(cat.subcategories)
        : [],
    }));

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/category-list/");
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(normalizeCategories(data));
      setSelectedIds(new Set()); 
      addToast("Categories refreshed successfully", "success");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Couldn't load categories. Check API and token.");
      addToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  async function createCategory({ name, parent = null }) {
    if (!name?.trim()) return null;
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (parent) formData.append("parent", parent);

      const res = await api.post("/category-create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addToast(`Category "${name.trim()}" created successfully`, "success");
      await fetchCategories();
      return res.data;
    } catch (err) {
      console.error("Create category failed:", err.response?.data || err);
      setError("Creating category failed: " + JSON.stringify(err.response?.data || err.message));
      addToast("Failed to create category", "error");
      return null;
    }
  }

  async function deleteCategory(id, name) {
    if (!id) return;
    setError("");
    try {
      await api.delete(`/category/${id}/delete/`);
      addToast(`Category "${name}" deleted successfully`, "success");
      await fetchCategories();
    } catch (err) {
      console.error("Delete category failed:", err.response?.data || err);
      setError("Delete failed: " + JSON.stringify(err.response?.data || err.message));
      addToast("Failed to delete category", "error");
    }
  }

  // ⭐ Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // ⭐ Select All
  const selectAll = () => {
    if (selectedIds.size === categories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c) => c.id)));
    }
  };

  // ⭐ Delete Selected
  const deleteSelected = async () => {
    if (selectedIds.size === 0) {
      addToast("Please select at least one category", "warning");
      return;
    }
    
    // Close modal first
    setModalOpen(false);
    
    setError("");
    setLoading(true);
    try {
      const deletePromises = Array.from(selectedIds).map((id) =>
        api.delete(`/category/${id}/delete/`)
      );
      await Promise.all(deletePromises);
      setSelectedIds(new Set());
      addToast(`Deleted ${selectedIds.size} categories successfully`, "success");
      await fetchCategories();
      setDeleteMode(false); // exit delete mode
    } catch (err) {
      console.error("Bulk delete failed:", err);
      setError("Bulk delete failed: " + (err.response?.data || err.message));
      addToast("Failed to delete categories", "error");
    } finally {
      setLoading(false);
    }
  };

  // Excel Upload Handler
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = null;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/category-create/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log("Backend response:", res.data);
      addToast("Excel uploaded successfully!", "success");
      await fetchCategories();
    } catch (err) {
      console.error("Excel upload failed:", err);
      setError("Excel upload failed: " + (err.response?.data?.error || err.message));
      addToast("Excel upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  function CategoryNode({ node, level = 0 }) {
    const [childName, setChildName] = useState("");
    const [showChildInput, setShowChildInput] = useState(false);
    const [expanded, setExpanded] = useState(true);

    const icons = ["📂", "📁", "📝"];
    const icon = icons[level] || "🔹";

    return (
      <li className="transition-all duration-300 ease-in-out hover:scale-[1.01]">
        <div
          className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm hover:shadow-md transition"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center gap-2">
            {/* ⭐ Show checkbox only in delete mode */}
            {deleteMode && (
              <input
                type="checkbox"
                checked={selectedIds.has(node.id)}
                onChange={() => toggleSelect(node.id)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
            )}

            {node.subcategories.length > 0 && (
              <button
                className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                onClick={() => setExpanded((e) => !e)}
              >
                {expanded ? "▼" : "▶"}
              </button>
            )}
            <span className="text-lg">{icon}</span>
            <span
              className={`${
                level === 0
                  ? "font-bold text-gray-800"
                  : level === 1
                  ? "font-semibold text-gray-700"
                  : "text-gray-600"
              }`}
            >
              {node.name}
            </span>
          </div>

          {!deleteMode && (
            <div className="flex gap-2">
              <button
                className="text-sm px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                onClick={() => setShowChildInput((s) => !s)}
              >
                ➕ Sub
              </button>
              <button
                className="text-sm px-2 py-1 rounded bg-red-200 hover:bg-red-100 text-red-700 transition-colors"
                onClick={() => {
                  showConfirmation({
                    title: "Delete Category",
                    message: `Are you sure you want to delete "${node.name}"? This action cannot be undone.`,
                    confirmText: "Delete",
                    onConfirm: () => deleteCategory(node.id, node.name)
                  });
                }}
              >
                🗑️ 
              </button>
            </div>
          )}
        </div>

        {showChildInput && !deleteMode && (
          <div className="mt-2 ml-10 flex gap-2 items-center animate-in fade-in duration-300">
            <input
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Subcategory name"
              className="border border-gray-300 rounded px-3 py-1 flex-1 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
              onClick={() => {
                createCategory({ name: childName, parent: node.id });
                setChildName("");
                setShowChildInput(false);
              }}
            >
              Add
            </button>
          </div>
        )}

        {expanded && node.subcategories.length > 0 && (
          <ul className="mt-2 space-y-2 animate-in fade-in duration-300">
            {node.subcategories.map((child) => (
              <CategoryNode key={child.id} node={child} level={level + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-8">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />

      <h1 className="text-xl sm:text-2xl font-bold mb-1">
        📂 Category Management
      </h1>
      <p className="text-gray-600 mb-4">
       
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 animate-pulse">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:items-center">
  {!deleteMode && (
    <input
      value={rootName}
      onChange={(e) => setRootName(e.target.value)}
      placeholder="Root category name"
      className="flex-1 border border-gray-300 rounded px-3 py-2 min-w-[220px] transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  )}

  <div className="flex flex-wrap gap-2">
    {!deleteMode && (
      <>
        {/* Add Root as icon */}
        <button
          className="px-3 py-2 rounded bg-green-300 text-white hover:bg-green-700 transition-transform hover:scale-110 flex items-center justify-center"
          onClick={() => {
            createCategory({ name: rootName, parent: null });
            setRootName("");
          }}
          title="Add Root Category"
        >
          ➕
        </button>

        {/* Refresh as icon */}
        <button
          className="px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-transform hover:scale-110 flex items-center justify-center"
          onClick={fetchCategories}
          disabled={loading}
          title="Refresh"
        >
          🔄
        </button>

        {/* Upload Excel as icon */}
        <label
          className={`px-3 py-2 rounded text-white cursor-pointer flex items-center justify-center transition-transform ${uploading ? 'bg-blue-400 animate-pulse' : 'bg-blue-600 hover:bg-blue-700 hover:scale-110 transform'}`}
          title="Upload Excel"
        >
          {uploading ? "⏳" : "📊"}
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </>
    )}

    {categories.length > 0 && (
      <>
        {!deleteMode ? (
          // Delete Mode icon button
          <button
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-transform hover:scale-110 flex items-center justify-center"
            onClick={() => setDeleteMode(true)}
            title="Delete Mode"
          >
            🗑️
          </button>
        ) : (
          <>
            {/* Select/Deselect All */}
            <button
              className="px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-transform hover:scale-110 flex items-center justify-center"
              onClick={selectAll}
              title={selectedIds.size === categories.length ? "Deselect All" : "Select All"}
            >
              ✅
            </button>

            {/* Delete Selected */}
            <button
              className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={() => {
                showConfirmation({
                  title: "Delete Categories",
                  message: `Are you sure you want to delete ${selectedIds.size} categories? This action cannot be undone.`,
                  confirmText: `Delete ${selectedIds.size} Categories`,
                  onConfirm: deleteSelected
                });
              }}
              disabled={loading || selectedIds.size === 0}
              title={`Delete Selected (${selectedIds.size})`}
            >
              🗑️
            </button>

            {/* Cancel Delete Mode */}
            <button
              className="px-3 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition-transform hover:scale-110 flex items-center justify-center"
              onClick={() => {
                setDeleteMode(false);
                setSelectedIds(new Set());
              }}
              title="Cancel Delete Mode"
            >
              ❌
            </button>
          </>
        )}
      </>
    )}
  </div>
</div>


      <div className="rounded-xl border bg-white p-4 shadow-sm transition-all duration-300">
        {loading ? (
          <div className="text-gray-600 flex items-center">
            <span className="animate-spin mr-2">⏳</span> Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-gray-600 animate-pulse">
            No categories yet. Add one above 👆
          </div>
        ) : (
          <ul className="space-y-2">
            {categories.map((node) => (
              <CategoryNode key={node.id} node={node} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}