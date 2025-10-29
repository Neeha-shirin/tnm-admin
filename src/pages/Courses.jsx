
import { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx"; 
import api from "../api"; 
import StatsCard from "../components/StatsCard";

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
        <p className="text-sm font-medium">{message}</p>
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
          
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
          <p className="text-gray-500 text-sm text-center mb-6">{message}</p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
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

// Search Component
const SearchBar = ({ searchTerm, onSearchChange, resultsCount }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search categories..."
        className="block w-half pl-10 pr-20 py-2.5 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
      {searchTerm && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {resultsCount} results
          </span>
        </div>
      )}
    </div>
  );
};

// Animated Image Upload Component
const ImageUploadSection = ({ categoryId, currentImage, onImageUpload, onImageRemove, addToast }) => {
  const [uploading, setUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      await onImageUpload(categoryId, file);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    onImageRemove(categoryId);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Animated Profile Image Container */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative transition-all duration-300 ${
          currentImage ? 'scale-100' : 'scale-90'
        } ${isHovered ? 'scale-110' : ''}`}>
          {/* Profile Image or Placeholder */}
          {currentImage ? (
            <>
              <img 
                src={currentImage} 
                alt="Category" 
                className="w-10 h-10 object-cover rounded-full border-2 border-blue-300 shadow-lg transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-xl"
              />
              {/* Animated Remove Button */}
              <button
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 hover:scale-125 hover:bg-red-600 shadow-lg"
              >
                ×
              </button>
              {/* Shine Effect on Hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            </>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center transition-all duration-300 group-hover:from-blue-100 group-hover:to-blue-200 group-hover:border-blue-400 group-hover:shadow-lg">
              <svg 
                className={`w-5 h-5 text-gray-500 transition-all duration-300 group-hover:text-blue-500 group-hover:scale-110 ${
                  uploading ? 'animate-pulse' : ''
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Progress Indicator */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Enhanced Upload Button */}
      <div className="relative">
        <label 
          className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-full border cursor-pointer transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            uploading 
              ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white border-blue-500 shadow-lg scale-105' 
              : currentImage
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 hover:from-green-100 hover:to-emerald-100 hover:text-green-800 hover:border-green-300 hover:shadow-md'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:text-blue-800 hover:border-blue-300 hover:shadow-md'
          }`}
        >
          {uploading ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="animate-pulse">Uploading</span>
            </>
          ) : (
            <>
              <svg className={`w-3 h-3 transition-transform duration-300 ${currentImage ? 'rotate-12 scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {currentImage ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                )}
              </svg>
              <span>{currentImage ? 'Change' : 'Upload'}</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ 
  category, 
  level = 0, 
  isSelected, 
  onToggleSelect, 
  onAddSubcategory, 
  onDelete,
  onImageUpload,
  onImageRemove,
  deleteMode,
  searchTerm,
  expandedCategories,
  onToggleExpand,
  addToast
}) => {
  const [showChildInput, setShowChildInput] = useState(false);
  const [childName, setChildName] = useState("");
  
  const hasChildren = category.subcategories && category.subcategories.length > 0;
  const isExpanded = expandedCategories.has(category.id);
  
  // Highlight search matches
  const highlightMatch = (text, search) => {
    if (!search) return text;
    
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-100 text-yellow-800 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  const getCategoryIcon = (level, hasChildren, isExpanded) => {
    if (level === 0) {
      return hasChildren ? (isExpanded ? "📂" : "📁") : "📄";
    }
    if (level === 1) {
      return hasChildren ? (isExpanded ? "📂" : "📁") : "📄";
    }
    return "📄";
  };

  const getCategoryStyle = (level) => {
    const baseStyles = "font-medium";
    if (level === 0) return `${baseStyles} text-gray-900 text-base`;
    if (level === 1) return `${baseStyles} text-gray-800 text-sm`;
    return `${baseStyles} text-gray-700 text-sm`;
  };

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-lg ${
        level > 0 ? 'ml-8' : ''
      } ${isSelected ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50 transform scale-[1.02]' : ''} ${
        category.image ? 'border-l-4 border-l-blue-400' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Checkbox for delete mode */}
            {deleteMode && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(category.id)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all duration-200 hover:scale-110"
              />
            )}
            
            {/* Expand/Collapse button with animation */}
            {hasChildren && (
              <button
                onClick={() => onToggleExpand(category.id)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <svg 
                  className={`w-4 h-4 transform transition-all duration-300 ${isExpanded ? 'rotate-90 text-blue-600' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            {!hasChildren && <div className="w-6 h-6"></div>}
            
            {/* Animated Category Icon/Image */}
            <div className="flex items-center space-x-3">
              <div className={`relative transition-all duration-300 transform hover:scale-110 ${
                category.image ? 'ring-2 ring-blue-200 rounded-full' : ''
              }`}>
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt="Category" 
                    className="w-8 h-8 object-cover rounded-full shadow-md"
                  />
                ) : (
                  <span className="text-xl transition-all duration-300 hover:scale-110">
                    {getCategoryIcon(level, hasChildren, isExpanded)}
                  </span>
                )}
                {/* Online indicator for categories with images */}
                {category.image && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            </div>
            
            {/* Category Name */}
            <div className={`${getCategoryStyle(level)} transition-all duration-300 ${
              category.image ? 'font-semibold' : ''
            }`}>
              {searchTerm ? highlightMatch(category.name, searchTerm) : category.name}
            </div>
            
            {/* Enhanced Child count badge */}
            {hasChildren && (
              <span className="flex-shrink-0 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-sm">
                {category.subcategories.length}
              </span>
            )}
          </div>

          {/* Enhanced Action Buttons */}
          {!deleteMode && (
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              {/* Animated Image Upload Section */}
              <ImageUploadSection
                categoryId={category.id}
                currentImage={category.image}
                onImageUpload={onImageUpload}
                onImageRemove={onImageRemove}
                addToast={addToast}
              />
              
              

              {/* Enhanced Add Sub Button */}
              <button
                onClick={() => setShowChildInput(!showChildInput)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-blue-400"
              >
                <svg className="w-3 h-3 mr-1.5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Sub
              </button>

              {/* Enhanced Delete Button */}
              <button
                onClick={() => onDelete(category.id, category.name)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 border border-red-400"
              >
                <svg className="w-3 h-3 mr-1.5 transition-transform duration-300 hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
              {/* Static Checkbox - Added after upload button */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-500 transition-all duration-200"
                  // This is a static checkbox, no functionality attached
                />
              </div>
            </div>
            
          )}
        </div>

        {/* Enhanced Add Subcategory Input */}
        {showChildInput && (
          <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex space-x-2">
              <input
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter subcategory name..."
                className="flex-1 border border-blue-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                autoFocus
              />
              <button
                onClick={() => {
                  if (childName.trim()) {
                    onAddSubcategory(category.id, childName.trim());
                    setChildName("");
                    setShowChildInput(false);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Create
              </button>
              <button
                onClick={() => setShowChildInput(false)}
                className="px-4 py-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-medium rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recursive Children */}
      {hasChildren && isExpanded && (
        <div className="border-t border-blue-100 bg-gradient-to-b from-blue-50/50 to-transparent">
          <div className="p-3 space-y-2">
            {category.subcategories.map((subcategory) => (
              <CategoryCard
                key={subcategory.id}
                category={subcategory}
                level={level + 1}
                isSelected={isSelected}
                onToggleSelect={onToggleSelect}
                onAddSubcategory={onAddSubcategory}
                onDelete={onDelete}
                onImageUpload={onImageUpload}
                onImageRemove={onImageRemove}
                deleteMode={deleteMode}
                searchTerm={searchTerm}
                expandedCategories={expandedCategories}
                onToggleExpand={onToggleExpand}
                addToast={addToast}
              />
            ))}
          </div>
        </div>
      )}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCategories = getAllCategoryIds(categories).length;
    const rootCategories = categories.length;
    const selectedCount = selectedIds.size;
    
    return { totalCategories, rootCategories, selectedCount };
  }, [categories, selectedIds]);

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
      addToast("Categories loaded successfully", "success");
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

  // Image upload function
  const handleImageUpload = async (categoryId, file) => {
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category_id", categoryId);

      const res = await api.post("/category-upload-image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addToast("Image uploaded successfully", "success");
      await fetchCategories();
      return res.data;
    } catch (err) {
      console.error("Image upload failed:", err.response?.data || err);
      setError("Image upload failed: " + JSON.stringify(err.response?.data || err.message));
      addToast("Failed to upload image", "error");
      throw err;
    }
  };

  // Image remove function
  const handleImageRemove = async (categoryId) => {
    setError("");
    try {
      await api.delete(`/category-remove-image/${categoryId}/`);
      addToast("Image removed successfully", "success");
      await fetchCategories();
    } catch (err) {
      console.error("Image remove failed:", err.response?.data || err);
      setError("Image remove failed: " + JSON.stringify(err.response?.data || err.message));
      addToast("Failed to remove image", "error");
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    const searchLower = searchTerm.toLowerCase();

    const filterAndSortCategories = (cats) => {
      const matched = [];
      const unmatched = [];

      cats.forEach(cat => {
        const filteredChildren = cat.subcategories ? filterAndSortCategories(cat.subcategories) : [];
        const nameMatch = cat.name.toLowerCase().includes(searchLower);
        const hasMatchingChild = filteredChildren.length > 0;

        if (nameMatch || hasMatchingChild) {
          setExpandedCategories(prev => new Set([...prev, cat.id]));
          const newCat = {
            ...cat,
            subcategories: filteredChildren
          };
          if (nameMatch) matched.push(newCat);
          else unmatched.push(newCat);
        }
      });

      return [...matched, ...unmatched];
    };

    return filterAndSortCategories(categories);
  }, [categories, searchTerm]);

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Select All visible categories
  const selectAll = () => {
    const allVisibleIds = getAllCategoryIds(filteredCategories);
    
    if (selectedIds.size === allVisibleIds.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allVisibleIds));
    }
  };

  // Delete Selected
  const deleteSelected = async () => {
    if (selectedIds.size === 0) {
      addToast("Please select at least one category", "warning");
      return;
    }
    
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
      setDeleteMode(false);
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

  // Toggle category expansion
  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Add subcategory helper
  const handleAddSubcategory = (parentId, name) => {
    createCategory({ name, parent: parentId });
  };

  // Handle delete with confirmation
  const handleDelete = (id, name) => {
    showConfirmation({
      title: "Delete Category",
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: "Delete",
      onConfirm: () => deleteCategory(id, name)
    });
  };

  return (
    <div className="">
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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 text-sm mt-1">Organize and manage your category hierarchy</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              deleteMode ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {deleteMode ? 'Delete Mode' : 'Edit Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total Categories"
          value={stats.totalCategories}
          icon="fas fa-th-large"
          color="border-l-emerald-500"
        />
        <StatsCard
          title="Root Categories"
          value={stats.rootCategories}
          icon="fas fa-folder"
          color="border-l-green-500"
        />     
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          resultsCount={filteredCategories.length}
        />
      </div>

      {/* Controls Section */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            {!deleteMode && (
              <div className="flex gap-3 flex-1">
                <input
                  value={rootName}
                  onChange={(e) => setRootName(e.target.value)}
                  placeholder="Enter new root category name"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    createCategory({ name: rootName, parent: null });
                    setRootName("");
                  }}
                  disabled={!rootName.trim()}
                >
                  Add Root
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Action Buttons */}
            {!deleteMode ? (
              <>
                <button
                  onClick={fetchCategories}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>

                <label className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg border cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  uploading ? 'bg-blue-400 text-white border-blue-400 animate-pulse' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Upload Excel'}
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>

                {categories.length > 0 && (
                  <button
                    onClick={() => setDeleteMode(true)}
                    className="inline-flex items-center px-4 py-2.5 bg-white text-red-700 text-sm font-medium rounded-lg border border-red-300 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Mode
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={selectAll}
                  className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {selectedIds.size === getAllCategoryIds(filteredCategories).length ? 'Deselect All' : 'Select All'}
                </button>

                <button
                  onClick={() => {
                    showConfirmation({
                      title: "Delete Categories",
                      message: `Are you sure you want to delete ${selectedIds.size} categories? This action cannot be undone.`,
                      confirmText: `Delete ${selectedIds.size} Categories`,
                      onConfirm: deleteSelected
                    });
                  }}
                  disabled={loading || selectedIds.size === 0}
                  className="inline-flex items-center px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete ({selectedIds.size})
                </button>

                <button
                  onClick={() => {
                    setDeleteMode(false);
                    setSelectedIds(new Set());
                  }}
                  className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Loading categories...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center p-12">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {searchTerm ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-gray-500 text-xs mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by creating your first root category'
              }
            </p>
            {!searchTerm && !deleteMode && (
              <button
                onClick={() => document.querySelector('input[placeholder*="root"]')?.focus()}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Create First Category
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                level={0}
                isSelected={selectedIds.has(category.id)}
                onToggleSelect={toggleSelect}
                onAddSubcategory={handleAddSubcategory}
                onDelete={handleDelete}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                deleteMode={deleteMode}
                searchTerm={searchTerm}
                expandedCategories={expandedCategories}
                onToggleExpand={toggleExpand}
                addToast={addToast}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get all category IDs
function getAllCategoryIds(categories) {
  let ids = [];
  categories.forEach(cat => {
    ids.push(cat.id);
    if (cat.subcategories) {
      ids = ids.concat(getAllCategoryIds(cat.subcategories));
    }
  });
  return ids;
}