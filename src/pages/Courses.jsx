// import { useEffect, useState } from "react";
// import * as XLSX from "xlsx"; 
// import api from "../api"; 


// // Toast Notification Component
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const bgColor = type === "success" ? "bg-green-500" : 
//                  type === "error" ? "bg-red-500" : 
//                  type === "warning" ? "bg-yellow-500" : "bg-blue-500";

//   return (
//     <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-in-out 
//                     animate-in slide-in-from-right-full fade-in`}>
//       <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}>
//         {type === "success" && <span>✅</span>}
//         {type === "error" && <span>❌</span>}
//         {type === "warning" && <span>⚠️</span>}
//         {type === "info" && <span>ℹ️</span>}
//         <p>{message}</p>
//       </div>
//     </div>
//   );
// };

// // Custom Confirmation Modal Component
// const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
//         onClick={onClose}
//       ></div>
      
//       {/* Modal */}
//       <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 animate-in fade-in-90 slide-in-from-bottom-10">
//         <div className="p-6">
//           <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//             <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//             </svg>
//           </div>
          
//           <h3 className="text-lg font-medium text-gray-900 text-center mb-2">{title}</h3>
//           <p className="text-gray-500 text-center mb-6">{message}</p>
          
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
//             >
//               {cancelText}
//             </button>
//             <button
//               onClick={onConfirm}
//               className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
//               autoFocus
//             >
//               {confirmText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function Course() {
//   const [categories, setCategories] = useState([]);
//   const [rootName, setRootName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [selectedIds, setSelectedIds] = useState(new Set()); 
//   const [deleteMode, setDeleteMode] = useState(false);
//   const [toasts, setToasts] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalConfig, setModalConfig] = useState({
//     title: "",
//     message: "",
//     onConfirm: () => {},
//     confirmText: "Delete",
//     cancelText: "Cancel"
//   });

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Show confirmation modal
//   const showConfirmation = (config) => {
//     setModalConfig(config);
//     setModalOpen(true);
//   };

//   // Add a new toast
//   const addToast = (message, type = "info") => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, message, type }]);
//     return id;
//   };

//   // Remove a toast
//   const removeToast = (id) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   const normalizeCategories = (cats) =>
//     cats.map((cat) => ({
//       ...cat,
//       subcategories: cat.subcategories
//         ? normalizeCategories(cat.subcategories)
//         : [],
//     }));

//   const fetchCategories = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/category-list/");
//       const data = Array.isArray(res.data) ? res.data : [];
//       setCategories(normalizeCategories(data));
//       setSelectedIds(new Set()); 
//       addToast("Categories refreshed successfully", "success");
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError("Couldn't load categories. Check API and token.");
//       addToast("Failed to load categories", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   async function createCategory({ name, parent = null }) {
//     if (!name?.trim()) return null;
//     setError("");
//     try {
//       const formData = new FormData();
//       formData.append("name", name.trim());
//       if (parent) formData.append("parent", parent);

//       const res = await api.post("/category-create/", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       addToast(`Category "${name.trim()}" created successfully`, "success");
//       await fetchCategories();
//       return res.data;
//     } catch (err) {
//       console.error("Create category failed:", err.response?.data || err);
//       setError("Creating category failed: " + JSON.stringify(err.response?.data || err.message));
//       addToast("Failed to create category", "error");
//       return null;
//     }
//   }

//   async function deleteCategory(id, name) {
//     if (!id) return;
//     setError("");
//     try {
//       await api.delete(`/category/${id}/delete/`);
//       addToast(`Category "${name}" deleted successfully`, "success");
//       await fetchCategories();
//     } catch (err) {
//       console.error("Delete category failed:", err.response?.data || err);
//       setError("Delete failed: " + JSON.stringify(err.response?.data || err.message));
//       addToast("Failed to delete category", "error");
//     }
//   }

//   // ⭐ Toggle selection
//   const toggleSelect = (id) => {
//     setSelectedIds((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) newSet.delete(id);
//       else newSet.add(id);
//       return newSet;
//     });
//   };

//   // ⭐ Select All
//   const selectAll = () => {
//     if (selectedIds.size === categories.length) {
//       setSelectedIds(new Set());
//     } else {
//       setSelectedIds(new Set(categories.map((c) => c.id)));
//     }
//   };

//   // ⭐ Delete Selected
//   const deleteSelected = async () => {
//     if (selectedIds.size === 0) {
//       addToast("Please select at least one category", "warning");
//       return;
//     }
    
//     // Close modal first
//     setModalOpen(false);
    
//     setError("");
//     setLoading(true);
//     try {
//       const deletePromises = Array.from(selectedIds).map((id) =>
//         api.delete(`/category/${id}/delete/`)
//       );
//       await Promise.all(deletePromises);
//       setSelectedIds(new Set());
//       addToast(`Deleted ${selectedIds.size} categories successfully`, "success");
//       await fetchCategories();
//       setDeleteMode(false); // exit delete mode
//     } catch (err) {
//       console.error("Bulk delete failed:", err);
//       setError("Bulk delete failed: " + (err.response?.data || err.message));
//       addToast("Failed to delete categories", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Excel Upload Handler
//   const handleExcelUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     e.target.value = null;
//     setUploading(true);
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await api.post("/category-create/", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       console.log("Backend response:", res.data);
//       addToast("Excel uploaded successfully!", "success");
//       await fetchCategories();
//     } catch (err) {
//       console.error("Excel upload failed:", err);
//       setError("Excel upload failed: " + (err.response?.data?.error || err.message));
//       addToast("Excel upload failed", "error");
//     } finally {
//       setUploading(false);
//     }
//   };

//   function CategoryNode({ node, level = 0 }) {
//     const [childName, setChildName] = useState("");
//     const [showChildInput, setShowChildInput] = useState(false);
//     const [expanded, setExpanded] = useState(true);

//     const icons = ["📂", "📁", "📝"];
//     const icon = icons[level] || "🔹";

//     return (
//       <li className="transition-all duration-300 ease-in-out hover:scale-[1.01]">
//         <div
//           className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm hover:shadow-md transition"
//           style={{ marginLeft: `${level * 20}px` }}
//         >
//           <div className="flex items-center gap-2">
//             {/* ⭐ Show checkbox only in delete mode */}
//             {deleteMode && (
//               <input
//                 type="checkbox"
//                 checked={selectedIds.has(node.id)}
//                 onChange={() => toggleSelect(node.id)}
//                 className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
//               />
//             )}

//             {node.subcategories.length > 0 && (
//               <button
//                 className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
//                 onClick={() => setExpanded((e) => !e)}
//               >
//                 {expanded ? "▼" : "▶"}
//               </button>
//             )}
//             <span className="text-lg">{icon}</span>
//             <span
//               className={`${
//                 level === 0
//                   ? "font-bold text-gray-800"
//                   : level === 1
//                   ? "font-semibold text-gray-700"
//                   : "text-gray-600"
//               }`}
//             >
//               {node.name}
//             </span>
//           </div>

//           {!deleteMode && (
//             <div className="flex gap-2">
//               <button
//                 className="text-sm px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
//                 onClick={() => setShowChildInput((s) => !s)}
//               >
//                 ➕ Sub
//               </button>
//               <button
//                 className="text-sm px-2 py-1 rounded bg-red-200 hover:bg-red-100 text-red-700 transition-colors"
//                 onClick={() => {
//                   showConfirmation({
//                     title: "Delete Category",
//                     message: `Are you sure you want to delete "${node.name}"? This action cannot be undone.`,
//                     confirmText: "Delete",
//                     onConfirm: () => deleteCategory(node.id, node.name)
//                   });
//                 }}
//               >
//                 🗑️ 
//               </button>
//             </div>
//           )}
//         </div>

//         {showChildInput && !deleteMode && (
//           <div className="mt-2 ml-10 flex gap-2 items-center animate-in fade-in duration-300">
//             <input
//               value={childName}
//               onChange={(e) => setChildName(e.target.value)}
//               placeholder="Subcategory name"
//               className="border border-gray-300 rounded px-3 py-1 flex-1 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             <button
//               className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
//               onClick={() => {
//                 createCategory({ name: childName, parent: node.id });
//                 setChildName("");
//                 setShowChildInput(false);
//               }}
//             >
//               Add
//             </button>
//           </div>
//         )}

//         {expanded && node.subcategories.length > 0 && (
//           <ul className="mt-2 space-y-2 animate-in fade-in duration-300">
//             {node.subcategories.map((child) => (
//               <CategoryNode key={child.id} node={child} level={level + 1} />
//             ))}
//           </ul>
//         )}
//       </li>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-8">
//       {/* Toast Container */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {toasts.map((toast) => (
//           <Toast 
//             key={toast.id} 
//             message={toast.message} 
//             type={toast.type} 
//             onClose={() => removeToast(toast.id)} 
//           />
//         ))}
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onConfirm={modalConfig.onConfirm}
//         title={modalConfig.title}
//         message={modalConfig.message}
//         confirmText={modalConfig.confirmText}
//         cancelText={modalConfig.cancelText}
//       />

//       <h1 className="text-xl sm:text-3xl font-bold mb-1">
//         📂 Category Management
//       </h1>
//       <p className="text-gray-600 mb-4">
       
//       </p>

//       {error && (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 animate-pulse">
//           {error}
//         </div>
//       )}

//       <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:items-center">
//   {!deleteMode && (
//     <input
//       value={rootName}
//       onChange={(e) => setRootName(e.target.value)}
//       placeholder="Root category name"
//       className="flex-1 border border-gray-300 rounded px-3 py-2 min-w-[220px] transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//     />
//   )}

//   <div className="flex flex-wrap gap-2">
//     {!deleteMode && (
//       <>
//         {/* Add Root as icon */}
//         <button
//           className="px-3 py-2 rounded bg-green-300 text-white hover:bg-green-700 transition-transform hover:scale-110 flex items-center justify-center"
//           onClick={() => {
//             createCategory({ name: rootName, parent: null });
//             setRootName("");
//           }}
//           title="Add Root Category"
//         >
//           ➕
//         </button>

//         {/* Refresh as icon */}
//         <button
//           className="px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-transform hover:scale-110 flex items-center justify-center"
//           onClick={fetchCategories}
//           disabled={loading}
//           title="Refresh"
//         >
//           🔄
//         </button>

//         {/* Upload Excel as icon */}
//         <label
//           className={`px-3 py-2 rounded text-white cursor-pointer flex items-center justify-center transition-transform ${uploading ? 'bg-blue-400 animate-pulse' : 'bg-blue-600 hover:bg-blue-700 hover:scale-110 transform'}`}
//           title="Upload Excel"
//         >
//           {uploading ? "⏳" : "📊"}
//           <input
//             type="file"
//             accept=".xlsx,.xls"
//             onChange={handleExcelUpload}
//             className="hidden"
//             disabled={uploading}
//           />
//         </label>
//       </>
//     )}

//     {categories.length > 0 && (
//       <>
//         {!deleteMode ? (
//           // Delete Mode icon button
//           <button
//             className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-transform hover:scale-110 flex items-center justify-center"
//             onClick={() => setDeleteMode(true)}
//             title="Delete Mode"
//           >
//             🗑️
//           </button>
//         ) : (
//           <>
//             {/* Select/Deselect All */}
//             <button
//               className="px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-transform hover:scale-110 flex items-center justify-center"
//               onClick={selectAll}
//               title={selectedIds.size === categories.length ? "Deselect All" : "Select All"}
//             >
//               ✅
//             </button>

//             {/* Delete Selected */}
//             <button
//               className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               onClick={() => {
//                 showConfirmation({
//                   title: "Delete Categories",
//                   message: `Are you sure you want to delete ${selectedIds.size} categories? This action cannot be undone.`,
//                   confirmText: `Delete ${selectedIds.size} Categories`,
//                   onConfirm: deleteSelected
//                 });
//               }}
//               disabled={loading || selectedIds.size === 0}
//               title={`Delete Selected (${selectedIds.size})`}
//             >
//               🗑️
//             </button>

//             {/* Cancel Delete Mode */}
//             <button
//               className="px-3 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition-transform hover:scale-110 flex items-center justify-center"
//               onClick={() => {
//                 setDeleteMode(false);
//                 setSelectedIds(new Set());
//               }}
//               title="Cancel Delete Mode"
//             >
//               ❌
//             </button>
//           </>
//         )}
//       </>
//     )}
//   </div>
// </div>


//       <div className="rounded-xl border bg-white p-4 shadow-sm transition-all duration-300">
//         {loading ? (
//           <div className="text-gray-600 flex items-center">
//             <span className="animate-spin mr-2">⏳</span> Loading categories...
//           </div>
//         ) : categories.length === 0 ? (
//           <div className="text-gray-600 animate-pulse">
//             No categories yet. Add one above 👆
//           </div>
//         ) : (
//           <ul className="space-y-2">
//             {categories.map((node) => (
//               <CategoryNode key={node.id} node={node} />
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// 2

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

// Category Card Component
const CategoryCard = ({ 
  category, 
  level = 0, 
  isSelected, 
  onToggleSelect, 
  onAddSubcategory, 
  onDelete,
  deleteMode,
  searchTerm,
  expandedCategories,
  onToggleExpand
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
      className={`bg-white border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm ${
        level > 0 ? 'ml-8' : ''
      } ${isSelected ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50' : ''}`}
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
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
            )}
            
            {/* Expand/Collapse button for categories with children */}
            {hasChildren && (
              <button
                onClick={() => onToggleExpand(category.id)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <svg 
                  className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            {/* Placeholder for alignment when no children */}
            {!hasChildren && <div className="w-6 h-6"></div>}
            
            {/* Category Icon */}
            <span className="text-lg flex-shrink-0">{getCategoryIcon(level, hasChildren, isExpanded)}</span>
            
            {/* Category Name with Search Highlighting */}
            <div className={getCategoryStyle(level)}>
              {searchTerm ? highlightMatch(category.name, searchTerm) : category.name}
            </div>
            
            {/* Child count badge */}
            {hasChildren && (
              <span className="flex-shrink-0 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full border border-gray-200">
                {category.subcategories.length}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {!deleteMode && (
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              <button
                onClick={() => setShowChildInput(!showChildInput)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Sub
              </button>
              <button
                onClick={() => onDelete(category.id, category.name)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-200"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Add Subcategory Input */}
        {showChildInput && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in duration-300">
            <div className="flex space-x-2">
              <input
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter subcategory name"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Create
              </button>
              <button
                onClick={() => setShowChildInput(false)}
                className="px-3 py-2 bg-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recursive Children */}
      {hasChildren && isExpanded && (
        <div className="border-t border-gray-100">
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
                deleteMode={deleteMode}
                searchTerm={searchTerm}
                expandedCategories={expandedCategories}
                onToggleExpand={onToggleExpand}
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

const filteredCategories = useMemo(() => {
  if (!searchTerm) return categories;

  const searchLower = searchTerm.toLowerCase();

  const filterAndSortCategories = (cats) => {
    const matched = [];
    const unmatched = [];

    cats.forEach(cat => {
      // Recursively filter children
      const filteredChildren = cat.subcategories ? filterAndSortCategories(cat.subcategories) : [];

      const nameMatch = cat.name.toLowerCase().includes(searchLower);
      const hasMatchingChild = filteredChildren.length > 0;

      if (nameMatch || hasMatchingChild) {
        // Expand this category if it matches
        setExpandedCategories(prev => new Set([...prev, cat.id]));

        const newCat = {
          ...cat,
          subcategories: filteredChildren
        };

        if (nameMatch) matched.push(newCat);
        else unmatched.push(newCat);
      }
    });

    // Matched categories come first
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
  const EmojiIcon = ({ emoji, color }) => (
  <div
    className={`w-10 h-10 flex items-center justify-center rounded-full ${color} text-2xl`}
  >
    <span className="translate-y-[1px]">{emoji}</span>
  </div>
);


  return (
    <div className="min-h-screen bg-gray-0 p-6">
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
        <StatsCard
          title="Selected"
          value={stats.selectedCount}
          icon="fas fa-check"
          color="border-l-teal-500"
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
                deleteMode={deleteMode}
                searchTerm={searchTerm}
                expandedCategories={expandedCategories}
                onToggleExpand={toggleExpand}
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


// 3

// import { useEffect, useState, useMemo } from "react";
// import * as XLSX from "xlsx"; 
// import api from "../api"; 

// // Toast Notification Component
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const bgColor = type === "success" ? "bg-green-500" : 
//                  type === "error" ? "bg-red-500" : 
//                  type === "warning" ? "bg-yellow-500" : "bg-blue-500";

//   return (
//     <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-in-out 
//                     animate-in slide-in-from-right-full fade-in`}>
//       <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}>
//         {type === "success" && <span>✅</span>}
//         {type === "error" && <span>❌</span>}
//         {type === "warning" && <span>⚠️</span>}
//         {type === "info" && <span>ℹ️</span>}
//         <p className="text-sm font-medium">{message}</p>
//       </div>
//     </div>
//   );
// };

// // Custom Confirmation Modal Component
// const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
//         onClick={onClose}
//       ></div>
      
//       {/* Modal */}
//       <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95 animate-in fade-in-90 slide-in-from-bottom-10">
//         <div className="p-6">
//           <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//             <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//             </svg>
//           </div>
          
//           <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
//           <p className="text-gray-500 text-sm text-center mb-6">{message}</p>
          
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
//             >
//               {cancelText}
//             </button>
//             <button
//               onClick={onConfirm}
//               className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
//               autoFocus
//             >
//               {confirmText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Stats Card Component
// const StatsCard = ({ title, value, icon, color }) => (
//   <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
//     <div className="flex items-center">
//       <div className={`p-3 rounded-full ${color} text-white mr-4`}>
//         <span className="text-xl">{icon}</span>
//       </div>
//       <div>
//         <h3 className="text-sm font-medium text-gray-500">{title}</h3>
//         <p className="text-2xl font-bold text-gray-800">{value}</p>
//       </div>
//     </div>
//   </div>
// );

// // Search Component
// const SearchBar = ({ searchTerm, onSearchChange, resultsCount }) => {
//   return (
//     <div className="relative max-w-md">
//       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//         <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//         </svg>
//       </div>
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => onSearchChange(e.target.value)}
//         placeholder="Search categories..."
//         className="block w-full pl-10 pr-20 py-2.5 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//       />
//       {searchTerm && (
//         <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//           <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//             {resultsCount} results
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// // Category Card Component
// const CategoryCard = ({ 
//   category, 
//   level = 0, 
//   isSelected, 
//   onToggleSelect, 
//   onAddSubcategory, 
//   onDelete,
//   deleteMode,
//   searchTerm,
//   expandedCategories,
//   onToggleExpand
// }) => {
//   const [showChildInput, setShowChildInput] = useState(false);
//   const [childName, setChildName] = useState("");
  
//   const hasChildren = category.subcategories && category.subcategories.length > 0;
//   const isExpanded = expandedCategories.has(category.id);
  
//   // Highlight search matches
//   const highlightMatch = (text, search) => {
//     if (!search) return text;
    
//     const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
//     const parts = text.split(regex);
    
//     return parts.map((part, index) => 
//       regex.test(part) ? (
//         <mark key={index} className="bg-yellow-100 text-yellow-800 px-1 rounded">{part}</mark>
//       ) : (
//         part
//       )
//     );
//   };

//   const getCategoryIcon = (level, hasChildren, isExpanded) => {
//     if (level === 0) return hasChildren ? (isExpanded ? "📂" : "📁") : "📄";
//     if (level === 1) return hasChildren ? (isExpanded ? "📂" : "📁") : "📄";
//     return "📄";
//   };

//   return (
//     <div 
//       className={`bg-white border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm ${
//         level > 0 ? 'ml-6' : ''
//       } ${isSelected ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50' : ''}`}
//     >
//       <div className="p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3 flex-1 min-w-0">
//             {/* Checkbox for delete mode */}
//             {deleteMode && (
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => onToggleSelect(category.id)}
//                 className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
//               />
//             )}
            
//             {/* Expand/Collapse button for categories with children */}
//             {hasChildren && (
//               <button
//                 onClick={() => onToggleExpand(category.id)}
//                 className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
//               >
//                 <svg 
//                   className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
//                   fill="none" 
//                   viewBox="0 0 24 24" 
//                   stroke="currentColor"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             )}
            
//             {/* Placeholder for alignment when no children */}
//             {!hasChildren && <div className="w-6 h-6"></div>}
            
//             {/* Category Icon */}
//             <span className="text-lg flex-shrink-0">{getCategoryIcon(level, hasChildren, isExpanded)}</span>
            
//             {/* Category Name with Search Highlighting */}
//             <div className={`font-medium ${level === 0 ? 'text-gray-900 text-base' : level === 1 ? 'text-gray-800 text-sm' : 'text-gray-700 text-sm'}`}>
//               {searchTerm ? highlightMatch(category.name, searchTerm) : category.name}
//             </div>
            
//             {/* Child count badge */}
//             {hasChildren && (
//               <span className="flex-shrink-0 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full border border-gray-200">
//                 {category.subcategories.length}
//               </span>
//             )}
//           </div>

//           {/* Action Buttons */}
//           {!deleteMode && (
//             <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
//               <button
//                 onClick={() => setShowChildInput(!showChildInput)}
//                 className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200"
//               >
//                 <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add Sub
//               </button>
//               <button
//                 onClick={() => onDelete(category.id, category.name)}
//                 className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 border border-red-200"
//               >
//                 <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//                 Delete
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Add Subcategory Input */}
//         {showChildInput && (
//           <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in duration-300">
//             <div className="flex space-x-2">
//               <input
//                 value={childName}
//                 onChange={(e) => setChildName(e.target.value)}
//                 placeholder="Enter subcategory name"
//                 className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 autoFocus
//               />
//               <button
//                 onClick={() => {
//                   if (childName.trim()) {
//                     onAddSubcategory(category.id, childName.trim());
//                     setChildName("");
//                     setShowChildInput(false);
//                   }
//                 }}
//                 className="px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
//               >
//                 Create
//               </button>
//               <button
//                 onClick={() => setShowChildInput(false)}
//                 className="px-3 py-2 bg-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Recursive Children */}
//       {hasChildren && isExpanded && (
//         <div className="border-t border-gray-100">
//           <div className="p-3 space-y-2">
//             {category.subcategories.map((subcategory) => (
//               <CategoryCard
//                 key={subcategory.id}
//                 category={subcategory}
//                 level={level + 1}
//                 isSelected={isSelected}
//                 onToggleSelect={onToggleSelect}
//                 onAddSubcategory={onAddSubcategory}
//                 onDelete={onDelete}
//                 deleteMode={deleteMode}
//                 searchTerm={searchTerm}
//                 expandedCategories={expandedCategories}
//                 onToggleExpand={onToggleExpand}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default function Course() {
//   const [categories, setCategories] = useState([]);
//   const [rootName, setRootName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [selectedIds, setSelectedIds] = useState(new Set()); 
//   const [deleteMode, setDeleteMode] = useState(false);
//   const [toasts, setToasts] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalConfig, setModalConfig] = useState({
//     title: "",
//     message: "",
//     onConfirm: () => {},
//     confirmText: "Delete",
//     cancelText: "Cancel"
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expandedCategories, setExpandedCategories] = useState(new Set());

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Calculate statistics
//   const stats = useMemo(() => {
//     let totalCategories = 0;
//     let rootCategories = 0;
//     let subCategories = 0;

//     const countCategories = (cats, level = 0) => {
//       cats.forEach(cat => {
//         totalCategories++;
//         if (level === 0) {
//           rootCategories++;
//         } else {
//           subCategories++;
//         }
//         if (cat.subcategories && cat.subcategories.length > 0) {
//           countCategories(cat.subcategories, level + 1);
//         }
//       });
//     };

//     countCategories(categories);
//     return { totalCategories, rootCategories, subCategories, selectedCount: selectedIds.size };
//   }, [categories, selectedIds]);

//   // Show confirmation modal
//   const showConfirmation = (config) => {
//     setModalConfig(config);
//     setModalOpen(true);
//   };

//   // Add a new toast
//   const addToast = (message, type = "info") => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, message, type }]);
//     return id;
//   };

//   // Remove a toast
//   const removeToast = (id) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   const normalizeCategories = (cats) =>
//     cats.map((cat) => ({
//       ...cat,
//       subcategories: cat.subcategories
//         ? normalizeCategories(cat.subcategories)
//         : [],
//     }));

//   const fetchCategories = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/category-list/");
//       const data = Array.isArray(res.data) ? res.data : [];
//       setCategories(normalizeCategories(data));
//       setSelectedIds(new Set());
//       setExpandedCategories(new Set()); // Reset expanded categories
//       addToast("Categories loaded successfully", "success");
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError("Couldn't load categories. Check API and token.");
//       addToast("Failed to load categories", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   async function createCategory({ name, parent = null }) {
//     if (!name?.trim()) return null;
//     setError("");
//     try {
//       const formData = new FormData();
//       formData.append("name", name.trim());
//       if (parent) formData.append("parent", parent);

//       const res = await api.post("/category-create/", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       addToast(`Category "${name.trim()}" created successfully`, "success");
//       await fetchCategories();
//       return res.data;
//     } catch (err) {
//       console.error("Create category failed:", err.response?.data || err);
//       setError("Creating category failed: " + JSON.stringify(err.response?.data || err.message));
//       addToast("Failed to create category", "error");
//       return null;
//     }
//   }

//   async function deleteCategory(id, name) {
//     if (!id) return;
//     setError("");
//     try {
//       await api.delete(`/category/${id}/delete/`);
//       addToast(`Category "${name}" deleted successfully`, "success");
//       await fetchCategories();
//     } catch (err) {
//       console.error("Delete category failed:", err.response?.data || err);
//       setError("Delete failed: " + JSON.stringify(err.response?.data || err.message));
//       addToast("Failed to delete category", "error");
//     }
//   }

//   const filteredCategories = useMemo(() => {
//     if (!searchTerm) return categories;

//     const searchLower = searchTerm.toLowerCase();

//     const filterAndSortCategories = (cats) => {
//       const matched = [];
//       const unmatched = [];

//       cats.forEach(cat => {
//         // Recursively filter children
//         const filteredChildren = cat.subcategories ? filterAndSortCategories(cat.subcategories) : [];

//         const nameMatch = cat.name.toLowerCase().includes(searchLower);
//         const hasMatchingChild = filteredChildren.length > 0;

//         if (nameMatch || hasMatchingChild) {
//           // Expand this category if it matches
//           setExpandedCategories(prev => new Set([...prev, cat.id]));

//           const newCat = {
//             ...cat,
//             subcategories: filteredChildren
//           };

//           if (nameMatch) matched.push(newCat);
//           else unmatched.push(newCat);
//         }
//       });

//       // Matched categories come first
//       return [...matched, ...unmatched];
//     };

//     return filterAndSortCategories(categories);
//   }, [categories, searchTerm]);

//   // Toggle selection
//   const toggleSelect = (id) => {
//     setSelectedIds((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) newSet.delete(id);
//       else newSet.add(id);
//       return newSet;
//     });
//   };

//   // Select All visible categories
//   const selectAll = () => {
//     const allVisibleIds = getAllCategoryIds(filteredCategories);
    
//     if (selectedIds.size === allVisibleIds.length) {
//       setSelectedIds(new Set());
//     } else {
//       setSelectedIds(new Set(allVisibleIds));
//     }
//   };

//   // Delete Selected
//   const deleteSelected = async () => {
//     if (selectedIds.size === 0) {
//       addToast("Please select at least one category", "warning");
//       return;
//     }
    
//     setModalOpen(false);
//     setError("");
//     setLoading(true);
//     try {
//       const deletePromises = Array.from(selectedIds).map((id) =>
//         api.delete(`/category/${id}/delete/`)
//       );
//       await Promise.all(deletePromises);
//       setSelectedIds(new Set());
//       addToast(`Deleted ${selectedIds.size} categories successfully`, "success");
//       await fetchCategories();
//       setDeleteMode(false);
//     } catch (err) {
//       console.error("Bulk delete failed:", err);
//       setError("Bulk delete failed: " + (err.response?.data || err.message));
//       addToast("Failed to delete categories", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Excel Upload Handler
//   const handleExcelUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     e.target.value = null;
//     setUploading(true);
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await api.post("/category-create/", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       console.log("Backend response:", res.data);
//       addToast("Excel uploaded successfully!", "success");
//       await fetchCategories();
//     } catch (err) {
//       console.error("Excel upload failed:", err);
//       setError("Excel upload failed: " + (err.response?.data?.error || err.message));
//       addToast("Excel upload failed", "error");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Toggle category expansion
//   const toggleExpand = (categoryId) => {
//     setExpandedCategories(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(categoryId)) {
//         newSet.delete(categoryId);
//       } else {
//         newSet.add(categoryId);
//       }
//       return newSet;
//     });
//   };

//   // Add subcategory helper
//   const handleAddSubcategory = (parentId, name) => {
//     createCategory({ name, parent: parentId });
//   };

//   // Handle delete with confirmation
//   const handleDelete = (id, name) => {
//     showConfirmation({
//       title: "Delete Category",
//       message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
//       confirmText: "Delete",
//       onConfirm: () => deleteCategory(id, name)
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Toast Container */}
//       <div className="fixed top-4 right-4 z-50 space-y-2">
//         {toasts.map((toast) => (
//           <Toast 
//             key={toast.id} 
//             message={toast.message} 
//             type={toast.type} 
//             onClose={() => removeToast(toast.id)} 
//           />
//         ))}
//       </div>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onConfirm={modalConfig.onConfirm}
//         title={modalConfig.title}
//         message={modalConfig.message}
//         confirmText={modalConfig.confirmText}
//         cancelText={modalConfig.cancelText}
//       />

//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
//             <p className="text-gray-600 text-sm mt-1">Organize and manage your category hierarchy</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//               deleteMode ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
//             }`}>
//               {deleteMode ? 'Delete Mode' : 'Edit Mode'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <StatsCard
//           title="Total Categories"
//           value={stats.totalCategories}
//           icon="📊"
//           color="bg-blue-500"
//         />
//         <StatsCard
//           title="Root Categories"
//           value={stats.rootCategories}
//           icon="🌳"
//           color="bg-green-500"
//         />
//         <StatsCard
//           title="Sub Categories"
//           value={stats.subCategories}
//           icon="📁"
//           color="bg-purple-500"
//         />
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
//           <div className="flex items-center">
//             <svg className="w-4 h-4 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <span className="text-sm font-medium text-red-700">{error}</span>
//           </div>
//         </div>
//       )}

//       {/* Search Bar */}
//       <div className="mb-6">
//         <SearchBar 
//           searchTerm={searchTerm}
//           onSearchChange={setSearchTerm}
//           resultsCount={filteredCategories.length}
//         />
//       </div>

//       {/* Controls Section */}
//       <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
//         <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//           <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
//             {!deleteMode && (
//               <div className="flex gap-3 flex-1">
//                 <input
//                   value={rootName}
//                   onChange={(e) => setRootName(e.target.value)}
//                   placeholder="Enter new root category name"
//                   className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <button
//                   className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={() => {
//                     createCategory({ name: rootName, parent: null });
//                     setRootName("");
//                   }}
//                   disabled={!rootName.trim()}
//                 >
//                   Add Root
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {/* Action Buttons */}
//             {!deleteMode ? (
//               <>
//                 <button
//                   onClick={fetchCategories}
//                   disabled={loading}
//                   className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
//                 >
//                   <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                   </svg>
//                   Refresh
//                 </button>

//                 <label className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg border cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   uploading ? 'bg-blue-400 text-white border-blue-400 animate-pulse' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                 }`}>
//                   <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   {uploading ? 'Uploading...' : 'Upload Excel'}
//                   <input
//                     type="file"
//                     accept=".xlsx,.xls"
//                     onChange={handleExcelUpload}
//                     className="hidden"
//                     disabled={uploading}
//                   />
//                 </label>

//                 {categories.length > 0 && (
//                   <button
//                     onClick={() => setDeleteMode(true)}
//                     className="inline-flex items-center px-4 py-2.5 bg-white text-red-700 text-sm font-medium rounded-lg border border-red-300 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
//                   >
//                     <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                     </svg>
//                     Delete Mode
//                   </button>
//                 )}
//               </>
//             ) : (
//               <>
//                 <button
//                   onClick={selectAll}
//                   className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 >
//                   <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   {selectedIds.size === getAllCategoryIds(filteredCategories).length ? 'Deselect All' : 'Select All'}
//                 </button>

//                 <button
//                   onClick={() => {
//                     showConfirmation({
//                       title: "Delete Categories",
//                       message: `Are you sure you want to delete ${selectedIds.size} categories? This action cannot be undone.`,
//                       confirmText: `Delete ${selectedIds.size} Categories`,
//                       onConfirm: deleteSelected
//                     });
//                   }}
//                   disabled={loading || selectedIds.size === 0}
//                   className="inline-flex items-center px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Delete ({selectedIds.size})
//                 </button>

//                 <button
//                   onClick={() => {
//                     setDeleteMode(false);
//                     setSelectedIds(new Set());
//                   }}
//                   className="inline-flex items-center px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 >
//                   Cancel
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Categories List */}
//       <div className="bg-white rounded-lg border border-gray-200">
//         {loading ? (
//           <div className="flex items-center justify-center p-12">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
//               <p className="text-gray-600 text-sm">Loading categories...</p>
//             </div>
//           </div>
//         ) : filteredCategories.length === 0 ? (
//           <div className="text-center p-12">
//             <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//             <h3 className="text-sm font-medium text-gray-900 mb-1">
//               {searchTerm ? 'No categories found' : 'No categories yet'}
//             </h3>
//             <p className="text-gray-500 text-xs mb-4">
//               {searchTerm 
//                 ? 'Try adjusting your search terms' 
//                 : 'Get started by creating your first root category'
//               }
//             </p>
//             {!searchTerm && !deleteMode && (
//               <button
//                 onClick={() => document.querySelector('input[placeholder*="root"]')?.focus()}
//                 className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Create First Category
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="p-4 space-y-3">
//             {filteredCategories.map((category) => (
//               <CategoryCard
//                 key={category.id}
//                 category={category}
//                 level={0}
//                 isSelected={selectedIds.has(category.id)}
//                 onToggleSelect={toggleSelect}
//                 onAddSubcategory={handleAddSubcategory}
//                 onDelete={handleDelete}
//                 deleteMode={deleteMode}
//                 searchTerm={searchTerm}
//                 expandedCategories={expandedCategories}
//                 onToggleExpand={toggleExpand}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Helper function to get all category IDs
// function getAllCategoryIds(categories) {
//   let ids = [];
//   categories.forEach(cat => {
//     ids.push(cat.id);
//     if (cat.subcategories) {
//       ids = ids.concat(getAllCategoryIds(cat.subcategories));
//     }
//   });
//   return ids;
// }