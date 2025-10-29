"use client";

import React, { useState, useEffect } from "react";
import api from "../api";
import { HiTrash, HiPencil, HiPlus, HiUser, HiMail, HiKey, HiUserGroup, HiX, HiCheck, HiExclamation } from "react-icons/hi";

function UserPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    role: "monitor",
  });
  const [editUserId, setEditUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  const roles = ["admin", "financier", "monitor"];

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await api.get("/role-assign-list/");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      showError("Failed to fetch users. Check your network or backend URL.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Modal functions
  const showSuccess = (message) => {
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const showError = (message) => {
    setModalMessage(message);
    setShowErrorModal(true);
  };

  const showValidationError = (message) => {
    setModalMessage(message);
    setShowValidationModal(true);
  };

  const handleSave = async () => {
  if (!form.email || !form.username || (!editUserId && !form.password)) {
    showValidationError("Please fill all required fields.");
    return;
  }

  const payload = {
  email: form.email,
  username: form.username,
  role: form.role,
};

// ✅ Only send password if creating OR updating with a new password
if (!editUserId) {
  payload.password = form.password; // Create user → password required
} else if (form.password && form.password.trim() !== "") {
  payload.password = form.password; // Update → only if user typed a new password
}


  setLoading(true);
  try {
    if (editUserId) {
      await api.put(`/update-role/${editUserId}/`, payload);
      showSuccess("User updated successfully!");
    } else {
      await api.post("/role-assign/", payload);
      showSuccess("User created successfully!");
    }

    setForm({ email: "", username: "", password: "", role: "monitor" });
    setEditUserId(null);
    fetchUsers();
  } catch (err) {
    console.error("Error saving user:", err);
    showError(
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Error saving user. Check console for details."
    );
  } finally {
    setLoading(false);
  }
};




  const handleEdit = (user) => {
    if (!user.id) return showError("Cannot edit a user without ID");
    setEditUserId(user.id);
    setForm({
      email: user.email ?? "",
      username: user.username ?? "",
      password: "", // blank by default for security
      role: user.role ?? "monitor",
    });
  };

  const confirmDelete = (id) => {
    if (!id) return showError("Cannot delete a user without ID");
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/delete-assign/${userToDelete}/`);
      showSuccess("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err.response || err);
      const backendMessage = err.response?.data?.detail || err.response?.data?.message;
      showError(
        backendMessage
          ? `Failed to delete user: ${backendMessage}`
          : "Failed to delete user. Check console for details."
      );
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 border-red-200";
      case "financier": return "bg-blue-100 text-blue-800 border-blue-200";
      case "monitor": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Modal Components
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-4">
            <HiCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Success!</h3>
          <p className="text-gray-600 text-center">{modalMessage}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowSuccessModal(false)}
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-emerald-700 transition duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  const ErrorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <HiX className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Error</h3>
          <p className="text-gray-600 text-center">{modalMessage}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowErrorModal(false)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-red-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  const ValidationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
            <HiExclamation className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Validation Required</h3>
          <p className="text-gray-600 text-center">{modalMessage}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowValidationModal(false)}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-yellow-700 transition duration-200"
          >
            Understand
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <HiExclamation className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Confirm Deletion</h3>
          <p className="text-gray-600 text-center">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-xl font-medium hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-red-700 transition duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-700 rounded-xl shadow-lg">
              <HiUserGroup className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin User Management</h1>
              <p className="text-gray-600">Manage system users and their roles</p>
            </div>
          </div>
        </div>

        {/* User Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-emerald-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <HiPlus className="mr-2 text-emerald-500" />
            {editUserId ? "Update User" : "Create New User"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <HiMail className="mr-2 text-emerald-500" />
                Email Address
              </label>
              <input
                type="text"
                placeholder="user@example.com"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <HiUser className="mr-2 text-emerald-500" />
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <HiKey className="mr-2 text-emerald-500" />
                Password
              </label>
              <input
                type="password"
                placeholder={editUserId ? "Leave blank to keep existing" : "Enter password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-emerald-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            {editUserId ? "Update User" : "Create User"}
          </button>
        </div>

        {/* Users Table Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">System Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id ?? index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.username ?? "—"}</div>
                        <div className="text-sm text-gray-500">{user.email ?? "—"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={!user.id}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit User"
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(user.id)}
                          disabled={!user.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete User"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <HiUserGroup className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400 text-sm">Create your first user to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Renderers */}
      {showSuccessModal && <SuccessModal />}
      {showErrorModal && <ErrorModal />}
      {showValidationModal && <ValidationModal />}
      {showDeleteModal && <DeleteConfirmationModal />}
    </div>
  );
}

export default UserPage;