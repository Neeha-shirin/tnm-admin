import React, { useState, useEffect } from "react";
import { Trash2, Save } from "lucide-react";

const TutorsTable = ({
  title,
  tutors = [],
  onRequestStatusChange,
  onDeleteTutor,
  variant,
  emptyMessage = "No data available",
  onRowClick,
  api,
}) => {
  const [localStatus, setLocalStatus] = useState(
    tutors.reduce((acc, t) => ({ ...acc, [t.id]: t.status }), {})
  );
  const [addToHomeState, setAddToHomeState] = useState(
    tutors.reduce((acc, t) => ({ ...acc, [t.id]: t.add_to_home }), {})
  );
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // number of tutors per page
  const paginatedTutors = tutors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



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
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <th className="px-6 py-3 text-center">S.No</th>
              <th className="px-6 py-3 text-center">Tutor</th>
              <th className="px-6 py-3 text-center">Activity</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          

          <tbody className="divide-y divide-gray-200">
            {paginatedTutors.length > 0 ? (
              paginatedTutors.map((tutor, index) => (


                <tr
                  key={`tutor-${tutor.id}`}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition-colors cursor-pointer`}
                  onClick={() => onRowClick && onRowClick(tutor)}
                >
                  {/* Serial Number */}
                  <td className="px-6 py-4 text-center font-medium text-gray-700">
                    {(currentPage - 1) * itemsPerPage + index + 1}

                  </td>

                  {/* Tutor Name with Profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tutor.profile_image || "/default-avatar.png"}
                        alt={tutor.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <span className="font-medium text-gray-800">
                        {tutor.name}
                      </span>
                    </div>
                  </td>

                  {/* Activity Column */}
                  <td className="px-6 py-4 text-center">
                    {tutor.activity ? (
                      <div className="flex items-center gap-2 justify-center">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            tutor.activity === "Active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-medium ${
                            tutor.activity === "Active"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {tutor.activity}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic tracking-wide">
                        Not Active
                      </span>

                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    {(variant === "approved" || variant === "rejected") &&
                    onRequestStatusChange ? (
                      <div className="flex justify-center">
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
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tutor.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : tutor.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {tutor.status}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    {variant === "requests" && onRequestStatusChange && (
                      <div className="flex justify-center gap-2">
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
                        <div className="flex justify-center items-center gap-2">
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
                                  console.error(
                                    "Failed to update add_to_home:",
                                    err
                                  );
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
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     {/* Pagination Controls */}
      {tutors.length > itemsPerPage &&
        (() => {
          const totalPages = Math.ceil(tutors.length / itemsPerPage);
          const maxVisiblePages = 5;

          let startPage = Math.max(1, currentPage - 2);
          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

          if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
          }

          return (
            <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-100 bg-gray-50">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 disabled:opacity-40"
              >
                Prev
              </button>

              {/* First Page */}
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-1 rounded-lg text-sm bg-white border"
                  >
                    1
                  </button>
                  <span className="px-2 text-gray-500">…</span>
                </>
              )}

              {/* Page Numbers */}
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Last Page */}
              {endPage < totalPages && (
                <>
                  <span className="px-2 text-gray-500">…</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1 rounded-lg text-sm bg-white border"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          );
        })()}

    </div>
  );
};

export default TutorsTable;