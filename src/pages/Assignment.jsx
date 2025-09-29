import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api.js";

const TutorAssignTable = () => {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tutorSearch, setTutorSearch] = useState("");
  const [activeTab, setActiveTab] = useState("students");
  const [assignMode, setAssignMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState(null);

  const [oldAssignedIds, setOldAssignedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, tutorsRes] = await Promise.all([
          api.get("/admin/students/"),
          api.get("/admin/tutors/approved/"),
        ]);

        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
        setTutors(Array.isArray(tutorsRes.data) ? tutorsRes.data : []);
      } catch (err) {
        console.error("API fetch error:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setAssignMode(false);
  };

  const handleAssignClick = (student) => {
  setSelectedStudent(student);
  setOldAssignedIds(student.tutors?.map((t) => Number(t.id)) || []);
  setSelectedTutors(student.tutors?.map((t) => Number(t.id)) || []);
  setAssignMode(true);
};




  const toggleTutor = (tutorId) => {
    const id = Number(tutorId); // ensure number
    setSelectedTutors((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
  if (!selectedStudent?.id) return;

  const studentId = Number(selectedStudent.id);
  const oldIds = (oldAssignedIds || []).map(Number);
  const newIds = selectedTutors.map(Number);

  const toAssign = newIds.filter((id) => !oldIds.includes(id));
  const toUnassign = oldIds.filter((id) => !newIds.includes(id));

  try {
    // Assign new tutors
    if (toAssign.length > 0) {
      await api.post("/admin/manage-assignments/", {
        student_ids: [studentId],
        tutor_ids: toAssign,
        action: "assign",
      });
    }

    // Unassign removed tutors
    if (toUnassign.length > 0) {
      await api.post("/admin/manage-assignments/", {
        student_ids: [studentId],
        tutor_ids: toUnassign,
        action: "unassign",
      });
    }

    // Update frontend state
    setStudents((prevStudents) =>
      prevStudents.map((s) =>
        s.id === studentId
          ? {
              ...s,
              tutors: tutors.filter((t) =>
                newIds.includes(Number(t.id))
              ),
            }
          : s
      )
    );

    setNotification({
      type: "success",
      message: "Tutor assignments updated successfully!",
    });
    setTimeout(() => setNotification(null), 3000);

    // Reset selections
    setSelectedStudent(null);
    setSelectedTutors([]);
    setAssignMode(false);
  } catch (err) {
    console.error(err.response?.data || err);
    setNotification({
      type: "error",
      message: "Failed to update tutor assignments",
    });
    setTimeout(() => setNotification(null), 3000);
  }
};

  const filteredStudents = students.filter(
    (s) =>
      (s.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTutors = tutors.filter(
    (t) =>
      (t.full_name || "").toLowerCase().includes(tutorSearch.toLowerCase()) ||
      (t.qualification || "").toLowerCase().includes(tutorSearch.toLowerCase())
  );

  console.log(students[0]?.tutors[0].full_name, "assigned tutors");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Tutor Assignment System
          </h1>
          <p className="text-slate-600">
            Manage student-tutor relationships with ease
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-2 md:space-x-4">
          {[
            { key: "students", label: "Students", icon: "👨‍🎓" },
            { key: "tutors", label: "Tutors", icon: "👨‍🏫" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Students Tab */}
        {!loading && activeTab === "students" && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-4 md:px-6 md:py-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-600">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-0 flex items-center">
                <span className="mr-2">📚</span> Student Directory
              </h2>
              <div className="relative w-full md:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search students..."
                  className="block w-full pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-emarald-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Assigned Tutors
                    </th>
                    <th className="px-4 py-3 md:px-6 md:py-3 text-right text-xs md:text-sm font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-100">
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-emarald-50 cursor-pointer transition"
                        onClick={() => handleRowClick(student)}
                      >
                        <td className="px-4 py-4 md:px-6 md:py-4 flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={
                                student.profile_photo || "/default-profile.png"
                              }
                              alt={student.full_name}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-green-200"
                            />
                            <span className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              👤
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {student.full_name || "-"}
                            </div>
                            {student.category && (
                              <div className="text-xs text-slate-500">
                                {student.category}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Assigned Tutors */}
                        <td className="px-6 py-4 whitespace-nowrap text-emerald-700">
                          {Array.isArray(student.tutors) &&
                          student.tutors.length > 0
                            ? student.tutors.map((s) => s.full_name).join(", ")
                            : "No students assigned"}
                        </td>

                        <td className="px-4 py-4 md:px-6 md:py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignClick(student);
                            }}
                            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-800 transition text-sm md:text-base"
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        {searchTerm
                          ? "No students match your search"
                          : "No students found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tutors Tab */}
        {!loading && activeTab === "tutors" && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-0 flex items-center">
                <span className="mr-2">👨‍🏫</span> Tutor Directory
              </h2>
              <div className="relative w-full md:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search tutors..."
                  className="block w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-400 focus:border-green-400"
                  value={tutorSearch}
                  onChange={(e) => setTutorSearch(e.target.value)}
                />
              </div>
            </div>

            {filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center mb-3">
                      {/* <img
                        src={tutor.profile_photo || "/default-profile.png"}
                        alt={tutor.full_name}
                        className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-green-200"
                      /> */}
                      <div>
                        <div className="font-semibold text-slate-800">
                          {tutor.full_name || "N/A"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {tutor.qualification || "No qualification"}
                        </div>
                      </div>
                    </div>
                    {/*                     
                    {Array.isArray(tutor.categories) && tutor.categories.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs text-slate-500 mb-1">Subjects:</div>
                        <div className="flex flex-wrap gap-1">
                          {tutor.categories.slice(0, 3).map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                            >
                              {cat.name ? cat.name : cat}
                            </span>
                          ))}
                          {tutor.categories.length > 3 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                              +{tutor.categories.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )} */}

                    {/* <div className="text-xs text-slate-500">
                      Students: {tutor.students_count || 0}
                    </div> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                {tutorSearch
                  ? "No tutors match your search"
                  : "No tutors found"}
              </div>
            )}
          </div>
        )}

        {/* Student Card Modal */}
        <AnimatePresence>
          {selectedStudent && !assignMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
              onClick={() => setSelectedStudent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    {selectedStudent.full_name}
                  </h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col items-center mb-4">
                  <div className="relative mb-2">
                    <img
                      src={
                        selectedStudent.profile_photo || "/default-profile.png"
                      }
                      alt={selectedStudent.full_name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      👤
                    </span>
                  </div>

                  {selectedStudent.category && (
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {selectedStudent.category}
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {selectedStudent.qualification && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">
                        Qualification
                      </div>
                      <div className="text-slate-800">
                        {selectedStudent.qualification}
                      </div>
                    </div>
                  )}

                  {Array.isArray(selectedStudent.categories) &&
                    selectedStudent.categories.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">
                          Subjects
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedStudent.categories.map((cat, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                            >
                              {cat.name ? cat.name : cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {Array.isArray(selectedStudent.tutors) &&
                    selectedStudent.tutors.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 mb-1">
                          Assigned Tutors
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedStudent.tutors.map((tutor) => (
                            <span
                              key={tutor.id}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                            >
                              {tutor.full_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleAssignClick(selectedStudent)}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-indigo-800 transition flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Assign Tutors
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tutor Assignment Modal */}
        <AnimatePresence>
          {selectedStudent && assignMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
              onClick={() => setAssignMode(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Assign Tutors to {selectedStudent.full_name}
                  </h2>
                  <button
                    onClick={() => setAssignMode(false)}
                    className="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="relative mb-4">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search tutors..."
                    className="block w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-400 focus:border-green-400"
                    value={tutorSearch}
                    onChange={(e) => setTutorSearch(e.target.value)}
                  />
                </div>

                <div className="flex-1 overflow-y-auto mb-6 border border-slate-200 rounded-xl p-2">
                  {filteredTutors.length > 0 ? (
                    filteredTutors.map((tutor) => (
                      <label
                        key={tutor.id}
                        className="flex items-start p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTutors.includes(Number(tutor.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTutors((prev) => [...prev, Number(tutor.id)]);
                            } else {
                              setSelectedTutors((prev) => prev.filter((id) => id !== Number(tutor.id)));
                            }
                          }}
                        />

                        <div className="ml-3 flex-1">
                          <div className="text-slate-800 font-medium flex items-center">
                            {tutor.full_name}
                            {selectedTutors.includes(tutor.id) && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                Selected
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 mb-2">
                            {tutor.qualification}
                          </div>

                          {Array.isArray(tutor.categories) &&
                            tutor.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {tutor.categories
                                  .slice(0, 3)
                                  .map((cat, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                                    >
                                      {cat.name ? cat.name : cat}
                                    </span>
                                  ))}
                                {tutor.categories.length > 3 && (
                                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                                    +{tutor.categories.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      {tutorSearch
                        ? "No tutors match your search"
                        : "No tutors available"}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setAssignMode(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 transition-colors"
                    disabled={selectedTutors.length === 0}
                  >
                    Save Assignments
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {notification && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};
export default TutorAssignTable;
