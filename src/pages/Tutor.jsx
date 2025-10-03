import React, { useState, useEffect } from "react";
import api from "../api";
import StatsCard from "../components/StatsCard";
import TutorsTable from "../components/TutorsTable/TutorsTable";
import { GraduationCap } from "lucide-react";

const Tutor = () => {
  const [tutors, setTutors] = useState([]);
  const [tutorRequests, setTutorRequests] = useState([]);
  const [rejectedTutors, setRejectedTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [approvedSearchTerm, setApprovedSearchTerm] = useState("");
  const [rejectedSearchTerm, setRejectedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // tutor to delete

  const [selectedTutor, setSelectedTutor] = useState(null); // for tutor details modal
  const [confirmAction, setConfirmAction] = useState({ tutor: null, action: null }); // for approve/reject confirmation

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/tutors/");
        const allTutors = res.data.map((t) => ({
          id: t.id,
          name: t.full_name,
          email: t.email,
          mobile_number: t.mobile_number || "N/A",
          subject: t.qualification || "N/A",
          status: t.is_approved
            ? "Approved"
            : t.is_rejected
            ? "Rejected"
            : "Pending",
          experience: t.experience_years || "N/A",
          rating: t.rating || 0,
          profile_image: t.profile_image || "/default-avatar.png",
          categories: t.categories || [],
          available_days: Array.isArray(t.available_days)
            ? t.available_days.map((day) => day.toString())
            : [Object.values(t.available_days || {}).join(" ")],
          description: t.description || "",
          hourly_rate: t.hourly_rate || "N/A",
        }));

        setTutorRequests(allTutors.filter((t) => t.status === "Pending"));

        const approvedRes = await api.get("/admin/tutors/approved/");
        const approvedTutors = approvedRes.data.map((t) => ({
          id: t.id,
          name: t.full_name,
          email: t.email,
          mobile_number: t.mobile_number || "N/A",
          subject: t.qualification || "N/A",
          status: "Approved",
          experience: t.experience_years || "N/A",
          rating: t.rating || 0,
          profile_image: t.profile_image || "/default-avatar.png",
          categories: t.categories || [],
          available_days: Array.isArray(t.available_days)
            ? t.available_days.map((day) => day.toString())
            : [Object.values(t.available_days || {}).join(" ")],
          description: t.description || "",
          hourly_rate: t.hourly_rate || "N/A",
        }));
        setTutors(approvedTutors);

        const rejectedRes = await api.get("/admin/tutors/rejected/");
        const rejected = rejectedRes.data.map((t) => ({
          id: t.id,
          name: t.full_name,
          email: t.email,
          mobile_number: t.mobile_number || "N/A",
          subject: t.qualification || "N/A",
          status: "Rejected",
          experience: t.experience_years || "N/A",
          rating: t.rating || 0,
          profile_image: t.profile_image || "/default-avatar.png",
          categories: t.categories || [],
          available_days: Array.isArray(t.available_days)
            ? t.available_days.map((day) => day.toString())
            : [Object.values(t.available_days || {}).join(" ")],
          description: t.description || "",
          hourly_rate: t.hourly_rate || "N/A",
        }));
        setRejectedTutors(rejected);
      } catch (err) {
        console.error("Error fetching tutors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const handleRequestStatusChange = async (tutorId, newStatus) => {
    try {
      const action = newStatus === "Approved" ? "approve" : "reject";
      const payload = { action };
      if (action === "reject") payload.reason = "Rejected by admin";

      const res = await api.patch(`/admin/review-user/${tutorId}/`, payload);

      const movedTutor =
        tutorRequests.find((t) => t.id === tutorId) ||
        tutors.find((t) => t.id === tutorId) ||
        rejectedTutors.find((t) => t.id === tutorId);

      if (!movedTutor) return;

      setTutorRequests((prev) => prev.filter((t) => t.id !== tutorId));
      setTutors((prev) => prev.filter((t) => t.id !== tutorId));
      setRejectedTutors((prev) => prev.filter((t) => t.id !== tutorId));

      const updatedTutor = {
        ...movedTutor,
        is_approved: res.data.is_approved,
        is_rejected: res.data.is_rejected,
        rejection_reason: res.data.rejection_reason || "",
        status: res.data.is_approved
          ? "Approved"
          : res.data.is_rejected
          ? "Rejected"
          : "Pending",
      };

      if (updatedTutor.status === "Approved") setTutors((prev) => [...prev, updatedTutor]);
      else if (updatedTutor.status === "Rejected")
        setRejectedTutors((prev) => [...prev, updatedTutor]);
      else setTutorRequests((prev) => [...prev, updatedTutor]);
    } catch (err) {
      console.error("❌ API call failed!", err);
    }
  };

  const handleDeleteTutor = (tutorId) => {
    const tutor = rejectedTutors.find((t) => t.id === tutorId);
    if (!tutor) return;
    setConfirmDelete(tutor); // open confirmation popup
  };

  // Separate filter functions for each table
  const filterBySearch = (arr, searchTerm) =>
    arr.filter(
      (t) => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-10 h-10 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-800">Tutor Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: "fas fa-user-check", title: "Approved Tutors", value: tutors.length, color: "border-l-green-500" },
            { icon: "fas fa-user-clock", title: "Pending Requests", value: tutorRequests.length, color: "border-l-yellow-500" },
            { icon: "fas fa-user-times", title: "Rejected Tutors", value: rejectedTutors.length, color: "border-l-red-500" },
          ].map((s, i) => (
            <StatsCard key={i} {...s} />
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <>
            {/* Pending Requests Table */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Pending Requests</h2>
                <input
                  type="text"
                  placeholder="Search pending tutors..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 w-64"
                  value={pendingSearchTerm}
                  onChange={(e) => setPendingSearchTerm(e.target.value)}
                />
              </div>
              <TutorsTable
                tutors={filterBySearch(tutorRequests, pendingSearchTerm)}
                variant="requests"
                onRequestStatusChange={(tutorId, newStatus) => {
                  const tutor = tutorRequests.find((t) => t.id === tutorId);
                  if (tutor) setConfirmAction({ tutor, action: newStatus });
                }}
                emptyMessage="No tutor requests found."
                onRowClick={setSelectedTutor}
              />
            </div>

            {/* Approved Table */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Approved Tutors</h2>
                <input
                  type="text"
                  placeholder="Search approved tutors..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                  value={approvedSearchTerm}
                  onChange={(e) => setApprovedSearchTerm(e.target.value)}
                />
              </div>
              <TutorsTable
                tutors={filterBySearch(tutors, approvedSearchTerm)}
                variant="approved"
                onRequestStatusChange={(tutorId, newStatus) => {
                  const tutor = tutors.find((t) => t.id === tutorId);
                  if (tutor) setConfirmAction({ tutor, action: newStatus });
                }}
                onRowClick={setSelectedTutor}
              />
            </div>

            {/* Rejected Table */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Rejected Tutors</h2>
                <input
                  type="text"
                  placeholder="Search rejected tutors..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-64"
                  value={rejectedSearchTerm}
                  onChange={(e) => setRejectedSearchTerm(e.target.value)}
                />
              </div>
              <TutorsTable
                tutors={filterBySearch(rejectedTutors, rejectedSearchTerm)}
                variant="rejected"
                onRequestStatusChange={(tutorId, newStatus) => {
                  const tutor = rejectedTutors.find((t) => t.id === tutorId);
                  if (tutor) setConfirmAction({ tutor, action: newStatus });
                }}
                onDeleteTutor={(tutorId) => {
                  const tutor = rejectedTutors.find((t) => t.id === tutorId);
                  if (tutor) setConfirmDelete(tutor); // open delete confirmation popup
                }}
                emptyMessage="No rejected tutors found."
                onRowClick={setSelectedTutor}
              />
            </div>
          </>
        )}

        {/* Tutor Details Modal */}
        {selectedTutor && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative max-h-[80vh] overflow-y-auto">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
                onClick={() => setSelectedTutor(null)}
              >
                ✕
              </button>

              <div className="flex items-center mb-4">
                <img
                  src={selectedTutor.profile_image || "/default-avatar.png"}
                  alt={selectedTutor.name || selectedTutor.full_name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200 mr-4"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedTutor.name || selectedTutor.full_name}</h2>
                  <p className="text-gray-500">{selectedTutor.email}</p>
                  <p className="text-gray-500">{selectedTutor.mobile_number}</p>
                </div>
              </div>

              {/* Categories */}
              {Array.isArray(selectedTutor.categories) && selectedTutor.categories.length > 0 && (
                <div className="mb-4">
                  <strong className="block text-gray-700 mb-1">Subjects:</strong>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        title={cat}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Days */}
              {Array.isArray(selectedTutor.available_days) && selectedTutor.available_days.length > 0 && (
                <div className="mb-4">
                  <strong className="block text-gray-700 mb-1">Available Days:</strong>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.available_days.map((day, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium shadow-sm hover:bg-green-200 transition"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedTutor.description && (
                <div className="mb-4">
                  <strong className="block text-gray-700 mb-1">Description:</strong>
                  <p className="text-gray-700">{selectedTutor.description}</p>
                </div>
              )}

              {/* Hourly Rate */}
              {selectedTutor.hourly_rate && (
                <p className="text-gray-700 mb-2">
                  <strong>Hourly Rate:</strong> {selectedTutor.hourly_rate}
                </p>
              )}

              <p className="text-gray-700">
                <strong>Status:</strong> {selectedTutor.status}
              </p>
            </div>
          </div>
        )}

        {/* Approve/Reject Confirmation Popup */}
        {confirmAction.tutor && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
                onClick={() => setConfirmAction({ tutor: null, action: null })}
              >
                ✕
              </button>
              <p className="mb-4 text-gray-800">
                Are you sure you want to <strong>{confirmAction.action}</strong> this tutor?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setConfirmAction({ tutor: null, action: null })}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    handleRequestStatusChange(confirmAction.tutor.id, confirmAction.action);
                    setConfirmAction({ tutor: null, action: null });
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
                onClick={() => setConfirmDelete(null)}
              >
                ✕
              </button>
              <p className="mb-4 text-gray-800">
                Are you sure you want to <strong className="text-red-600">delete</strong> {confirmDelete.name}?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={async () => {
                    try {
                      await api.delete(`/admin/rejected-tutors/${confirmDelete.id}/delete/`);
                      setRejectedTutors((prev) => prev.filter((t) => t.id !== confirmDelete.id));
                      setConfirmDelete(null);
                    } catch (err) {
                      console.error("Delete failed", err);
                      setConfirmDelete(null);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutor;