import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatsCard from "../components/StatsCard"; 

import api from "../api";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch students from backend
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
  try {
    setIsLoading(true);
    const res = await api.get("/admin/students/");
    console.log("API response:", res.data);

    // Map mobile_number -> phone
    const normalized = res.data.map(student => ({
      ...student,
      phone: student.mobile_number || "N/A"
    }));

    setStudents(normalized);
  } catch (err) {
    console.error("Error fetching students:", err);
  } finally {
    setIsLoading(false);
  }
};

  // Save edited student
  const handleSaveStudent = async () => {
    try {
      const payload = {
        full_name: editingStudent.full_name,
        email: editingStudent.email,
        mobile_number: editingStudent.phone,
        state: editingStudent.state,
        city: editingStudent.city,
        pincode: editingStudent.pincode,
        categories: Array.isArray(editingStudent.categories)
          ? editingStudent.categories
          : editingStudent.categories.split(",").map((c) => c.trim()),
        qualification: editingStudent.qualification || "",
        gender: editingStudent.gender || "",
        status: editingStudent.status,
      };
      await api.put(`/admin/students/${editingStudent.id}/`, payload);
      fetchStudents();
      setEditingStudent(null);
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  
// Delete student
const handleDeleteConfirm = async () => {
  if (!deletingStudent) return;

  try {
    console.log("Deleting student ID:", deletingStudent.id);

    // Call the correct backend delete API
    await api.delete(`/student/${deletingStudent.id}/delete/`);

    // Remove student from local state
    setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id));
    setDeletingStudent(null);

    alert("Student deleted successfully!");
  } catch (err) {
    console.error("Error deleting student:", err.response?.data || err.message);
    alert(`Delete failed: ${err.response?.data?.detail || err.message}`);
  }
};

  // Search/filter students
  const filteredStudents = students.filter((student) =>
    (student.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (student.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (student.phone?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (student.city?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (student.state?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (student.pincode?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (student.qualification?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (student.gender?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (Array.isArray(student.categories)
      ? student.categories.join(", ").toLowerCase()
      : student.categories?.toLowerCase()
    ).includes(searchTerm.toLowerCase())
  );

  // Status colors and icons
  const statusColors = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Inactive: "bg-red-100 text-red-800 border-red-200",
    "On Leave": "bg-amber-100 text-amber-800 border-amber-200",
  };

  const statusIcons = {
    Active: <i className="fas fa-check-circle mr-1"></i>,
    Inactive: <i className="fas fa-times-circle mr-1"></i>,
    "On Leave": <i className="fas fa-pause-circle mr-1"></i>,
  };

  // Modal component
  const Modal = ({ isOpen, onClose, children, size = "md" }) => {
    const sizeClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl"
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-900 bg-opacity-70 flex justify-center items-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`bg-white rounded-2xl shadow-2xl p-6 w-full ${sizeClasses[size]} relative overflow-auto max-h-[90vh]`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
              {children}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 text-emerald-500 hover:text-emerald-700 transition-colors duration-200 bg-emerald-50 p-1.5 rounded-full"
              >
                <i className="fas fa-times text-sm"></i>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 flex items-center">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2.5 rounded-xl mr-3 shadow-md">
                <i className="fas fa-user-graduate"></i>
              </span>
              Student Management
            </h1>
            <p className="text-emerald-700 mt-2 ml-1">Manage all students in your institution</p>
          </div>
          
        </motion.div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            <StatsCard
              title="Total Students"
              value={students.length}
              icon="fas fa-users"
              color="border-l-emerald-500"
            />
            <StatsCard
              title="Active Students"
              value={students.filter((s) => s.status === "Active").length}
              icon="fas fa-user-check"
              color="border-l-green-500"
            />
            <StatsCard
              title="Courses"
              value={8} 
              icon="fas fa-book"
              color="border-l-teal-500"
            />
  
        </div>


        {/* Search and Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-emerald-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search students by name, email, location..."
                className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl flex items-center"
              >
                <i className="fas fa-filter mr-2"></i> Filter
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Students table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden"
        >
          <div className="p-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-white">
            <h2 className="text-xl font-semibold text-emerald-800 flex items-center">
              <div className="bg-emerald-500 text-white p-3 rounded-xl mr-3 shadow-sm">
                <i className="fas fa-list"></i>
              </div>
              Student Directory
              <span className="ml-2 text-emerald-500 font-normal">
                ({filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'})
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-100">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-emerald-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-emerald-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-emerald-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-emerald-100 rounded w-6"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded-full bg-emerald-100"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-emerald-100 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-emerald-100 rounded w-40"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-emerald-100 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 bg-emerald-100 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <div className="h-8 bg-emerald-100 rounded-lg w-16"></div>
                          <div className="h-8 bg-emerald-100 rounded-lg w-16"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                      onClick={(e) => {
                        if (e.target.closest("button")) return;
                        setSelectedStudent(student);
                      }}
                    >
                      {/* Serial Number */}
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>

                      {/* Profile */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shadow-sm border border-emerald-200">
                          {student.profile_photo ? (
                            <img
                              src={student.profile_photo}
                              alt={student.full_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <i className="fas fa-user text-emerald-500"></i>
                          )}
                        </div>
                      </td>

                      {/* Full Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-emerald-900">{student.full_name}</div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap text-emerald-700">{student.email}</td>

                      {/* Location */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-emerald-700">
                          {student.city || 'N/A'}, {student.state || 'N/A'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[student.status] || "bg-gray-100 text-gray-800 border-gray-200"} shadow-sm`}>
                          {statusIcons[student.status]}
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2 transition-opacity">
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="text-red-600 bg-red-50 hover:text-red-800 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm border border-red-200"
                            title="Delete student"
                          >
                            <i className="fas fa-trash mr-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-emerald-700 flex flex-col items-center">
                        <i className="fas fa-user-slash text-4xl text-emerald-300 mb-3"></i>
                        <p className="font-medium">No students found</p>
                        <p className="text-sm mt-1 text-emerald-500">
                          {searchTerm ? 'Try adjusting your search terms' : 'Add your first student to get started'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Detail Card Modal */}
        <Modal isOpen={selectedStudent !== null} onClose={() => setSelectedStudent(null)} size="lg">
          {selectedStudent && (
            <>
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">Student Details</h2>
              <p className="text-emerald-600 text-sm mb-6">Complete information about the student</p>
              
              <div className="bg-emerald-30 p-5 rounded-xl shadow-md mb-6 flex items-center">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden shadow-md mr-4 border-2 border-emerald-200">
                  {selectedStudent.profile_photo ? (
                    <img src={selectedStudent.profile_photo} alt={selectedStudent.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <i className="fas fa-user text-emerald-500 text-2xl"></i>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-emerald-900">{selectedStudent.full_name}</h3>
                  <p className="text-emerald-600">{selectedStudent.email}</p>
                </div>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-emerald-800 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                <div className="text-xs text-emerald-500 font-medium mb-1">Phone</div>
                <div className="text-emerald-800">{selectedStudent.phone || "N/A"}</div>

              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                <div className="text-xs text-emerald-500 font-medium mb-1">Location</div>
                <div className="text-emerald-800">{selectedStudent.city || "N/A"}, {selectedStudent.state || "N/A"} {selectedStudent.pincode || ""}</div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                <div className="text-xs text-emerald-500 font-medium mb-1">Qualification</div>
                <div className="text-emerald-800">{selectedStudent.qualification || "N/A"}</div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                <div className="text-xs text-emerald-500 font-medium mb-1">Gender</div>
                <div className="text-emerald-800">{selectedStudent.gender || "N/A"}</div>
              </div>

              <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                <div className="text-xs text-emerald-500 font-medium mb-2">Categories</div>
                <ul className="list-disc pl-5 space-y-1 text-emerald-800">
                  {Array.isArray(selectedStudent.categories) 
                    ? selectedStudent.categories.map((cat, index) => (
                        <li key={index}>{cat}</li>
                      ))
                    : selectedStudent.categories 
                      ? <li>{selectedStudent.categories}</li>
                      : <li>N/A</li>
                  }
                </ul>
              </div>



              <div className="md:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
                <div className="text-xs text-emerald-500 font-medium mb-1">Status</div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[selectedStudent.status] || "bg-gray-100 text-gray-800"} shadow-sm`}>
                  {statusIcons[selectedStudent.status]}
                  {selectedStudent.status}
                </span>
              </div>

              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-emerald-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Close
                </motion.button>
              </div>
            </>
          )}
        </Modal>

        {/* Edit Student Modal */}
        <Modal isOpen={editingStudent !== null} onClose={() => setEditingStudent(null)} size="lg">
          {editingStudent && (
            <>
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">Edit Student</h2>
              <p className="text-emerald-600 text-sm mb-6">Update student information</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editingStudent.full_name || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, full_name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingStudent.email || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={editingStudent.phone || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-700 mb-1">Status</label>
                    <select
                      value={editingStudent.status || ""}
                      onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value})}
                      className="w-full px-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">Categories (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(editingStudent.categories) ? editingStudent.categories.join(", ") : editingStudent.categories || ""}
                    onChange={(e) => setEditingStudent({...editingStudent, categories: e.target.value})}
                    className="w-full px-4 py-2.5 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-emerald-100 space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveStudent}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  Save Changes
                </motion.button>
              </div>
            </>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deletingStudent !== null} onClose={() => setDeletingStudent(null)}>
          {deletingStudent && (
            <div className="text-center py-4">
              <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <h2 className="text-xl font-bold mb-2 text-emerald-900">Delete Student</h2>
              <p className="text-emerald-700 mb-6">
                Are you sure you want to delete <span className="font-semibold text-red-600">{deletingStudent.full_name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeletingStudent(null)}
                  className="px-4 py-2 border border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Student;