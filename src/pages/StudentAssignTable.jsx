import React, { useState, useEffect } from "react";
import api from "../api";

const StudentAssignTable = () => {
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [assignMode, setAssignMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [activeTab, setActiveTab] = useState("tutors");

  const [notification, setNotification] = useState(null);
  const [oldAssignedIds, setOldAssignedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 10;


useEffect(() => {
  const loadData = async () => {
    try {
      // 1️⃣ Fetch students from API
      const studentsRes = await api.get("/admin/students/");
      const studentsData = Array.isArray(studentsRes.data) ? studentsRes.data : [];
      setStudents(studentsData);

      // 2️⃣ Fetch tutors from API
      const tutorsRes = await api.get("/admin/tutors/approved/");
      let tutorsData = Array.isArray(tutorsRes.data) ? tutorsRes.data : [];

      // 3️⃣ Merge with localStorage to preserve assigned_students
      const cachedTutors = JSON.parse(localStorage.getItem("tutorsData") || "[]");
      tutorsData = tutorsData.map(tutor => {
        const cachedTutor = cachedTutors.find(c => c.id === tutor.id);
        if (cachedTutor) {
          tutor.assigned_students = cachedTutor.assigned_students || [];
        }
        return tutor;
      });

      setTutors(tutorsData);
      localStorage.setItem("tutorsData", JSON.stringify(tutorsData));

      // 4️⃣ Restore last selected tutor
      // const lastTutor = JSON.parse(localStorage.getItem("selectedTutor"));
      // if (lastTutor) {
      //   const tutorInState = tutorsData.find(t => t.id === lastTutor.id) || lastTutor;
      //   setSelectedTutor(tutorInState);

      //   // Pre-check checkboxes if assignMode was active
      //   if (lastTutor.assigned_students) {
      //     setSelectedStudents(lastTutor.assigned_students.map(s => Number(s.id)));
      //   }
      // }
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  loadData();
}, []);

const openTutorDetails = (tutor) => {
  if (!tutor || !tutor.id) return;

  const tutorInState = tutors.find(t => t.id === tutor.id) || tutor;

  setSelectedTutor(tutorInState);
  localStorage.setItem("selectedTutor", JSON.stringify(tutorInState));
};



const openAssignStudents = () => {
  if (!selectedTutor || !selectedTutor.id) return;

  // Get latest tutor data from state
  const tutorInState = tutors.find(t => t.id === selectedTutor.id);

  const assignedIds = Array.isArray(tutorInState?.assigned_students)
    ? tutorInState.assigned_students.map((s) => Number(s.id))
    : [];

  setOldAssignedIds(assignedIds);       // used for diffing when saving
  setSelectedStudents(assignedIds);     // ✅ pre-check checkboxes
  setSelectedTutor(tutorInState);       // make sure modal has latest tutor data
  setAssignMode(true);
};


const toggleStudent = (studentId) => {
  setSelectedStudents((prev) =>
    prev.includes(studentId)
      ? prev.filter((id) => id !== studentId)
      : [...prev, studentId]
  );
};


const handleSave = async () => {
  if (!selectedTutor || !selectedTutor.id) return;

  setSaving(true); // ⏳ Start loading

  const tutorId = Number(selectedTutor.id);
  const newIds = selectedStudents.map(Number);
  const oldIds = (oldAssignedIds || []).map(Number);

  const toAssign = newIds.filter((id) => !oldIds.includes(id));
  const toUnassign = oldIds.filter((id) => !newIds.includes(id));

  try {
    // 🔹 API Calls
    if (toAssign.length > 0) {
      await api.post("/admin/manage-assignments/", {
        tutor_ids: [tutorId],
        student_ids: toAssign,
        action: "assign",
      });
    }

    if (toUnassign.length > 0) {
      await api.post("/admin/manage-assignments/", {
        tutor_ids: [tutorId],
        student_ids: toUnassign,
        action: "unassign",
      });
    }

    // 🔹 Build updated assigned student list
    const updatedAssigned = students.filter((s) =>
      newIds.includes(Number(s.id))
    );

    // 🔹 Update tutors state and localStorage synchronously
    setTutors((prevTutors) => {
      const updatedTutors = prevTutors.map((t) =>
        t.id === tutorId ? { ...t, assigned_students: updatedAssigned } : t
      );
      localStorage.setItem("tutorsData", JSON.stringify(updatedTutors));
      return updatedTutors;
    });

    // 🔹 Update selectedTutor
    setSelectedTutor((prev) =>
      prev ? { ...prev, assigned_students: updatedAssigned } : prev
    );

    // ✅ Success notification
    setNotification({
      type: "success",
      message: "Assignments updated successfully!",
    });
    setTimeout(() => setNotification(null), 3000);

    // Close modal
    setAssignMode(false);
    setSelectedTutor(null);
  } catch (err) {
    console.error("Save assignments failed:", err);
    setNotification({
      type: "error",
      message: "Failed to update assignments",
    });
    setTimeout(() => setNotification(null), 3000);
  } finally {
    setSaving(false); // ✅ Stop loading
  }
};



  const filteredTutors = tutors.filter(
    (t) =>
      (t.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.qualification || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      (s.full_name || "").toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.qualification || "").toLowerCase().includes(studentSearch.toLowerCase())
  );
  // Pagination logic for tutors
const indexOfLastTutor = currentPage * tutorsPerPage;
const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
const currentTutors = filteredTutors.slice(indexOfFirstTutor, indexOfLastTutor);
const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Student Assignment System
          </h1>
          <p className="text-gray-600">Managing and  Assigning students to tutors efficiently</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("tutors")}
            className={`px-4 py-2 rounded-xl font-medium ${
              activeTab === "tutors" ? "bg-green-600 text-white" : "bg-white text-gray-700 border"
            }`}
          >
            Tutors
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2 rounded-xl font-medium ${
              activeTab === "students" ? "bg-green-600 text-white" : "bg-white text-gray-700 border"
            }`}
          >
            Students
          </button>
        </div>

        {/* Tutors Table */}
        {activeTab === "tutors" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
            <div className="px-6 py-4 border-b border-emerald-200 bg-emerald-50 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <h2 className="text-xl font-bold text-emerald-800">Tutor Directory</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutors..."
                  className="w-full md:w-64 border border-emerald-300 rounded-xl pl-10 pr-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-700 placeholder-emerald-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-3 text-emerald-400"></i>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-emerald-100">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                      Assigned Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-emerald-700 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-emerald-100">
  {currentTutors.map((tutor, index) => (

    <tr
      key={tutor.id ?? index}
      className="hover:bg-emerald-50 transition-colors duration-150 cursor-pointer group"
      onClick={() => openTutorDetails(tutor)}
    >
      {/* Serial Number */}
      <td className="px-6 py-4 whitespace-nowrap text-emerald-700">
        {(currentPage - 1) * tutorsPerPage + index + 1}
      </td>


      {/* Profile Photo + Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border border-emerald-200 group-hover:border-emerald-300">
            {tutor.profile_image ? (
              <img
                src={tutor.profile_image}
                alt={tutor.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <i className="fas fa-user text-emerald-500"></i>
            )}
          </div>
          <span className="ml-3 font-medium text-emerald-900">
            {tutor.full_name || "N/A"}
          </span>
        </div>
      </td>

      {/* Assigned Students */}
      <td className="px-6 py-4 whitespace-nowrap text-emerald-700">
        {Array.isArray(tutor.assigned_students) && tutor.assigned_students.length > 0
          ? tutor.assigned_students.map((s) => s.full_name).join(", ")
          : "No students assigned"}
      </td>
      {/* ✅ New Status Cell */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              tutor.is_paid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {tutor.is_paid ? "Paid" : "Unpaid"}
          </span>
        </td>


      {/* Action */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <span className="inline-flex items-center px-2.5 py-2 rounded-lg text-l font-medium bg-emerald-800 text-white">
          ASSIGN
          <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </span>
      </td>
    </tr>
  ))}
</tbody>
              </table>
                            {filteredTutors.length > tutorsPerPage && (
                  <div className="flex justify-center items-center py-4 bg-white border-t border-emerald-100 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          currentPage === i + 1
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}


            </div>
          </div>
        )}

        {/* Students Grid */}
        {activeTab === "students" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Student Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-xl p-4 hover:shadow-md transition">
                  <div className="font-semibold">{student.full_name || "N/A"}</div>
                  <div className="text-sm text-gray-600">Qualification: {student.qualification || "N/A"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tutor Details Modal */}
        {selectedTutor && !assignMode && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedTutor.full_name}</h2>
                <button
                  onClick={() => setSelectedTutor(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 mb-2">
                <strong>Qualification:</strong> {selectedTutor.qualification || "N/A"}
              </p>

              {Array.isArray(selectedTutor.categories) && selectedTutor.categories.length > 0 && (
                <div className="mb-4">
                  <strong className="block text-gray-700 mb-1">Subjects:</strong>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.categories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm" title={cat.name || cat}>
                        {cat.name || cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={openAssignStudents}
                  className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl hover:from-green-700 hover:to-emerald-800 transition font-semibold"
                >
                  Assign Students
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Students Modal */}
        {assignMode && selectedTutor && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Assign Students to {selectedTutor.full_name}</h2>
                <button
                  onClick={() => setAssignMode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                placeholder="Search students..."
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-green-600 focus:border-green-600"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />

              <div className="max-h-80 overflow-y-auto mb-6 border rounded-xl p-2">
                {filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex flex-col p-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start">
                      <input
  type="checkbox"
  className="h-5 w-5 text-green-700 rounded focus:ring-green-600 mt-1"
  checked={selectedStudents.includes(Number(student.id))}
  onChange={() => toggleStudent(Number(student.id))}
/>

                      <div className="ml-3 flex-1">
                        <div className="text-gray-700 font-medium">{student.full_name}</div>
                      </div>
                    </div>

                    {/* Categories */}
                    {Array.isArray(student.categories) && student.categories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {student.categories.map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                            title={cat.name || cat}
                          >
                            {cat.name || cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </label>
                ))}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setAssignMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
               <button
  onClick={handleSave}
  disabled={saving}
  className={`px-4 py-2 rounded-xl font-semibold text-white transition-colors ${
    saving
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800"
  }`}
>
  {saving ? "Saving..." : "Save Assignments"}
</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignTable;
