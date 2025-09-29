import React, { useState, useEffect } from "react";
import { Trash2, Save } from "lucide-react"; // icons

const TutorsTable = ({
  title,
  tutors = [],
  onRequestStatusChange,
  onDeleteTutor,
  variant,
  emptyMessage = "No data available",
  onRowClick, // new prop for row click (modal)
}) => {
  const [localStatus, setLocalStatus] = useState(
    tutors.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {})
  );

  useEffect(() => {
    setLocalStatus(
      tutors.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {})
    );
  }, [tutors]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-50">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">
          {tutors.length} {tutors.length === 1 ? "Tutor" : "Tutors"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <th className="px-6 py-3">Tutor</th>
              <th className="px-6 py-3">Qualification</th>
              <th className="px-6 py-3">Experience</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {tutors.length > 0 ? (
              tutors.map((tutor, index) => (
                <tr
                  key={`tutor-${tutor.id}`}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition-colors cursor-pointer`}
                  onClick={() => onRowClick && onRowClick(tutor)} // Row click opens modal
                >
                  {/* Tutor Name with Profile */}
                  <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                    <img
                      src={tutor.profile_image || "/default-avatar.png"}
                      alt={tutor.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    {tutor.name}
                  </td>

                  <td className="px-6 py-4 text-gray-700">{tutor.subject}</td>
                  <td className="px-6 py-4 text-gray-700">{tutor.experience}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {(variant === "approved" || variant === "rejected") &&
                    onRequestStatusChange ? (
                      <select
                        value={localStatus[tutor.id]}
                        onChange={(e) =>
                          setLocalStatus({
                            ...localStatus,
                            [tutor.id]: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white shadow-sm focus:ring focus:ring-indigo-200"
                        onClick={(e) => e.stopPropagation()} // Prevent modal on dropdown click
                      >
                        <option value="Approved">✅ Approved</option>
                        <option value="Rejected">❌ Rejected</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tutor.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : tutor.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tutor.status}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    {variant === "requests" && onRequestStatusChange && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevent modal
                            onRequestStatusChange(tutor.id, "Approved");
                          }}
                          className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevent modal
                            onRequestStatusChange(tutor.id, "Rejected");
                          }}
                          className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {(variant === "approved" || variant === "rejected") &&
                      onRequestStatusChange && (
                        <>
                          {/* Save Icon Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // prevent modal
                              onRequestStatusChange(
                                tutor.id,
                                localStatus[tutor.id]
                              );
                            }}
                            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>

                          {/* Delete Icon Button */}
                          {variant === "rejected" && onDeleteTutor && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // prevent modal
                                onDeleteTutor(tutor.id);
                              }}
                              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TutorsTable;
