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
  api,
}) => {
  const [localStatus, setLocalStatus] = useState(
    tutors.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {})
  );
  const [addToHomeState, setAddToHomeState] = useState(
  tutors.reduce((acc, t) => ({ ...acc, [t.id]: t.add_to_home }), {})
);

  useEffect(() => {
    setLocalStatus(
      tutors.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {})
    );
  }, [tutors]);
  
 useEffect(() => {
  setAddToHomeState(
    tutors.reduce((acc, t) => ({ ...acc, [t.id]: t.add_to_home }), {})
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
              <th className="px-6 py-3">S.No</th>
              <th className="px-6 py-3">Tutor</th>
              <th className="px-6 py-3">Activity</th>
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
                  onClick={() => onRowClick && onRowClick(tutor)}
                >
                  {/* Serial Number */}
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {index + 1}
                  </td>

                  {/* Tutor Name with Profile */}
                  <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                    <img
                      src={tutor.profile_image || "/default-avatar.png"}
                      alt={tutor.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    {tutor.name}
                  </td>

                  {/* Activity Column */}
                  <td className="px-6 py-4 text-gray-700">
                    {tutor.activity || (
                      <span className="text-gray-400 italic">
                        No recent activity
                      </span>
                    )}
                  </td>

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
                        onClick={(e) => e.stopPropagation()}
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
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {variant === "requests" && onRequestStatusChange && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestStatusChange(tutor.id, "Approved");
                          }}
                          className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestStatusChange(tutor.id, "Rejected");
                          }}
                          className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {(variant === "approved" || variant === "rejected") &&
                      onRequestStatusChange && (
                        <div className="flex justify-end items-center gap-2">
                          {/* Save Icon Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
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

                          {/* Add to Homepage Checkbox */}
                          {variant === "approved" && (
                      <input
                        type="checkbox"
                        checked={addToHomeState[tutor.id] || false}
                        onClick={(e) => e.stopPropagation()}
                        onChange={async (e) => {
                          const newValue = e.target.checked;
                          setAddToHomeState((prev) => ({
                            ...prev,
                            [tutor.id]: newValue,
                          }));

                          try {
                            await api.patch(
                              `/admin/tutor/${tutor.tutor_id}/update-add-to-home/`,
                              {
                                add_to_home: newValue,
                              }
                            );
                            console.log(
                              `Tutor ${tutor.tutor_id} add_to_home updated to:`,
                              newValue
                            );
                          } catch (err) {
                            console.error("Failed to update add_to_home:", err);
                            alert("Failed to update. Please try again.");
                            // revert checkbox on failure
                            setAddToHomeState((prev) => ({
                              ...prev,
                              [tutor.tutor_id]: !newValue,
                            }));
                          }
                        }}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        title="Add to Homepage"
                      />
                    )}

                          {/* Delete Icon Button */}
                          {variant === "rejected" && onDeleteTutor && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTutor(tutor.id);
                              }}
                              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
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
