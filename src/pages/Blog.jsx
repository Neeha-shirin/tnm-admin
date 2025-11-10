import { useState, useEffect } from "react";
import api from "../api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  FiTrash2,
  FiEdit,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiFileText,
  FiImage,
} from "react-icons/fi";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    photo: null,
  });
  const [editing, setEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/blogs/");
      const mappedBlogs = data.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.body,
        photo: b.image
          ? b.image.startsWith("http")
            ? b.image
            : `${process.env.REACT_APP_API_URL}${b.image}`
          : null,
      }));
      setBlogs(mappedBlogs);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, photo: file }));

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("body", form.description);
    if (form.photo) formData.append("image", form.photo);

    try {
      setLoading(true);
      setError(null);

      if (!editing) {
        await api.post("/blogs/create/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put(`/blogs/${form.id}/update/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchBlogs();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setForm({
      id: blog.id,
      title: blog.title,
      description: blog.description,
      photo: null,
    });
    setImagePreview(blog.photo);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm({ id: null, title: "", description: "", photo: null });
    setImagePreview(null);
    setEditing(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await api.delete(`/blogs/${deleteModal.id}/delete/`);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteModal.id));
      setDeleteModal({ open: false, id: null });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id) => setDeleteModal({ open: true, id });
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null });

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-900 to-teal-900 bg-clip-text text-transparent mb-4 p-5">
            Blog Management
          </h1>
          <p className="text-emerald-700 text-lg max-w-3xl mx-auto">
            Create, edit, and manage your blog posts with our intuitive editor.
            Share your stories with the world.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm flex items-center gap-3 animate-fade-in">
            <FiXCircle size={24} className="flex-shrink-0" />
            <div>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <FiXCircle size={20} />
            </button>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-100 p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <FiFileText className="text-emerald-600 text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-900">
                {editing ? "✏️ Edit Blog Post" : "📝 Create New Post"}
              </h2>
            </div>
            {editing && (
              <button
                onClick={resetForm}
                className="px-4 py-2 text-emerald-600 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all flex items-center gap-2"
              >
                <FiPlus className="rotate-45" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter a compelling title..."
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
                    Cover Image
                  </label>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-dashed border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                      />
                    </div>

                    {(imagePreview || form.photo) && (
                      <div className="relative group">
                        <img
                          src={imagePreview || URL.createObjectURL(form.photo)}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-xl border-2 border-emerald-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setForm((prev) => ({ ...prev, photo: null }));
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiXCircle size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Content Editor */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-2 uppercase tracking-wide">
                  Blog Content
                </label>
                <div className="border-2 border-emerald-200 rounded-xl overflow-hidden focus-within:border-emerald-400 transition-all duration-200">
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, description: value }))
                    }
                    modules={{
                      toolbar: {
                        container: [
                          [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headings
                          ["bold", "italic", "underline", "strike"], // Basic styles
                          [{ script: "sub" }, { script: "super" }], // Sub/super script
                          [{ color: [] }, { background: [] }], // Text & background color
                          [{ font: [] }], // Font family
                          [{ size: ["small", false, "large", "huge"] }], // Font size
                          [{ align: [] }], // Alignment
                          [{ list: "ordered" }, { list: "bullet" }], // Lists
                          [{ indent: "-1" }, { indent: "+1" }], // Indent
                          ["blockquote", "code-block"], // Quote + code block
                          ["link", "image", "video"], // Media
                          ["clean"], // Remove formatting
                        ],
                      },
                    }}
                    formats={[
                      "header",
                      "font",
                      "size",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "script",
                      "color",
                      "background",
                      "align",
                      "list",
                      "bullet",
                      "indent",
                      "blockquote",
                      "code-block",
                      "link",
                      "image",
                      "video",
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-emerald-700 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[200px] justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{editing ? "Updating..." : "Publishing..."}</span>
                  </>
                ) : (
                  <>
                    <FiFileText size={20} />
                    <span>
                      {editing ? "Update Blog Post" : "Publish Blog Post"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Blog Posts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <FiImage className="text-emerald-600 text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-900">
                Your Blog Posts
              </h2>
            </div>
            <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold">
              {blogs.length} {blogs.length === 1 ? "post" : "posts"}
            </span>
          </div>

          {loading && blogs.length === 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="w-full h-48 bg-emerald-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-emerald-200 rounded w-3/4 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-emerald-200 rounded"></div>
                    <div className="h-3 bg-emerald-200 rounded w-5/6"></div>
                    <div className="h-3 bg-emerald-200 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 bg-white/80 rounded-3xl shadow-lg">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                No blog posts yet
              </h3>
              <p className="text-emerald-600 mb-6">
                Start writing your first blog post using the form above!
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-6 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
              >
                Create First Post
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-50 flex flex-col"
                >
                  {/* Blog Image */}
                  <div className="relative overflow-hidden rounded-t-2xl">
                    {blog.photo ? (
                      <img
                        src={blog.photo}
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white text-4xl font-bold">
                        {blog.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors shadow-sm"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(blog.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-emerald-900 text-lg mb-2 line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>
                    <div className="text-emerald-700 text-sm mb-4 flex-1">
                      <p className="line-clamp-3 leading-relaxed">
                        {stripHtml(blog.description).substring(0, 120)}...
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-emerald-100">
                      <span className="text-xs text-emerald-500">
                        {new Date().toLocaleDateString()}
                      </span>
                      <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1 text-sm"
                        >
                          <FiEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(blog.id)}
                          className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 text-sm"
                        >
                          <FiTrash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="text-red-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                Delete Blog Post
              </h2>
              <p className="text-emerald-700">
                This action cannot be undone. The blog post will be permanently
                removed.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={closeDeleteModal}
                disabled={loading}
                className="px-6 py-3 border-2 border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all flex items-center gap-2 min-w-[120px] justify-center"
              >
                <FiXCircle /> Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all flex items-center gap-2 min-w-[120px] justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiCheckCircle />
                )}
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}