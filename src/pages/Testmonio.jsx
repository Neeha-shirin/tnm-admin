import { useState, useEffect } from "react";
import api from "../api";

export default function Testmonio() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({
    id: null,
    full_name: "",
    profile_photo: null,
    description: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/testimonials/")
      .then((res) => {
        setTestimonials(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch testimonials error:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_photo") {
      setForm({ ...form, profile_photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.description) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("full_name", form.full_name);
    formData.append("description", form.description);
    if (form.profile_photo) {
      formData.append("profile_photo", form.profile_photo);
    }

    try {
      if (editing) {
        const res = await api.put(`/testimonials/${form.id}/update/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTestimonials((prev) => prev.map((t) => (t.id === form.id ? res.data : t)));
        setEditing(false);
      } else {
        const res = await api.post("/testimonials/create/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setTestimonials((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
    }

    setForm({ id: null, full_name: "", profile_photo: null, description: "" });
    setLoading(false);
  };

  const handleEdit = (t) => {
    setForm({
      id: t.id,
      full_name: t.full_name,
      description: t.description,
      profile_photo: null,
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/testimonials/${deleteId}/delete/`);
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setForm({ id: null, full_name: "", profile_photo: null, description: "" });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Testimonial Manager
          </h1>
          <p className="text-emerald-700 text-lg max-w-2xl mx-auto">
            Manage your testimonials with ease. Add, edit, or remove customer feedback to showcase on your website.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-emerald-900">
              {editing ? "✏️ Edit Testimonial" : "➕ Add New Testimonial"}
            </h2>
            {editing && (
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-emerald-600 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form className="grid grid-cols-1 lg:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
                  Profile Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="profile_photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-dashed border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
                <p className="text-sm text-emerald-600 mt-2">Optional: Upload a profile picture</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
                Testimonial Content
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Share what your customer had to say about your service..."
                className="w-full h-40 px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 resize-none"
                required
              ></textarea>
              <div className="flex items-center space-x-6 mt-4">
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-700 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{editing ? "Update Testimonial" : "Add Testimonial"}</span>
                  )}
                </button>

                {/* Dummy Checkbox */}
                <label className="flex items-center space-x-2 text-emerald-700">
                  <input
                    type="checkbox"
                    name="dummy_checkbox"
                    checked={form.dummy_checkbox || false}
                    onChange={(e) =>
                      setForm({ ...form, dummy_checkbox: e.target.checked })
                    }
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span>Add to homepage</span>
                </label>
              </div>


            </div>
          </form>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-emerald-900">📋 All Testimonials</h2>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
              {testimonials.length} {testimonials.length === 1 ? 'testimonial' : 'testimonials'}
            </span>
          </div>

          {loading && testimonials.length === 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-emerald-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-emerald-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-emerald-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-emerald-200 rounded"></div>
                    <div className="h-3 bg-emerald-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 bg-white/80 rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">No testimonials yet</h3>
              <p className="text-emerald-600">Add your first testimonial using the form above!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-50"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {t.profile_photo ? (
                          <img
                            src={t.profile_photo}
                            alt={t.full_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-300 shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {t.full_name?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-emerald-900 text-lg">{t.full_name}</h3>
                          <div className="flex text-amber-400">
                            {"★".repeat(5)}
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(t.id);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-emerald-700 leading-relaxed text-sm line-clamp-4">
                      "{t.description}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">Delete Testimonial</h2>
              <p className="text-emerald-700">This action cannot be undone. Are you sure you want to delete this testimonial?</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 border-2 border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}