import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

// ✅ Reusable Modal Component with Animation
const Modal = ({ isOpen, onClose, children, size = "md" }) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`bg-white rounded-xl shadow-2xl p-6 w-full ${sizeClasses[size]} relative`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <i className="fas fa-times text-lg"></i>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StatsCard = ({ icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-6`}
  >
    <div className="flex items-center">
      <div
        className={`p-3 rounded-lg ${color
          .replace("border-l-", "bg-")
          .replace("-500", "-100")} ${color
          .replace("border-l-", "text-")
          .replace("-500", "-600")} mr-4`}
      >
        <i className={`${icon} text-xl`}></i>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </motion.div>
);

// Input Field Component
const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
    />
  </div>
);

// Header Component
const Header = () => (
  <motion.header
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg"
  >
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white/20 p-2 rounded-lg mr-3">
            <i className="fas fa-credit-card text-xl"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Plans & Payments</h1>
        </div>
      </div>
    </div>
  </motion.header>
);

// Plans Table Component
const PlansTable = ({ plans, onEditPlan, onDeletePlan, onAddPlan }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden"
  >
    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg mr-3">
          <i className="fas fa-list-alt"></i>
        </div>
        Subscription Plans
      </h2>
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 5px 15px rgba(5, 150, 105, 0.2)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddPlan}
        className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-emerald-500 flex items-center"
      >
        <i className="fas fa-plus mr-2"></i>
        Add Plan
      </motion.button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-600 text-sm uppercase border-b border-gray-200 bg-gray-50">
            <th className="py-4 px-6 font-medium">Plan</th>
            <th className="py-4 px-6 font-medium">Price</th>
            <th className="py-4 px-6 font-medium">Description</th>
            <th className="py-4 px-6 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {plans.map((plan) => (
              <motion.tr
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-4 px-6">
                  <span className="font-medium text-gray-800">{plan.plan}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="font-semibold text-emerald-700">
                    ₹{plan.price}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {plan.description.map((point, i) => (
                      <li key={i} className="mb-1">
                        {point}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center space-x-2">
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 8px rgba(59, 130, 246, 0.4)",
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEditPlan(plan)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <i className="fas fa-edit"></i>
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 8px rgba(239, 68, 68, 0.4)",
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDeletePlan(plan)}
                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  </motion.div>
);

// Payments Table Component
const PaymentsTable = ({ payments }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
          <i className="fas fa-credit-card"></i>
        </div>
        Payment History
      </h2>
      <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1.5 rounded-full">
        {payments.length} payments
      </span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-600 text-sm uppercase border-b border-gray-200 bg-gray-50">
            <th className="py-4 px-6 font-medium">Student</th>
            <th className="py-4 px-6 font-medium">Plan</th>
            <th className="py-4 px-6 font-medium">Amount</th>
            <th className="py-4 px-6 font-medium">Date</th>
            <th className="py-4 px-6 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((pay, idx) => (
            <motion.tr
              key={pay.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="py-4 px-6">
                <div className="flex items-center">
                  <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <i className="fas fa-user text-gray-600"></i>
                  </div>
                  <span className="font-medium">{pay.student_name}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {pay.plan_name}
                </span>
              </td>
              <td className="py-4 px-6 font-semibold text-gray-800">
                ₹{pay.amount}
              </td>
              <td className="py-4 px-6 text-gray-600">
                {new Date(pay.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="py-4 px-6">
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    pay.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <i
                    className={`fas ${
                      pay.status === "paid" ? "fa-check-circle" : "fa-clock"
                    } mr-1`}
                  ></i>
                  {pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}
                </motion.span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// Main Component
export default function Payment() {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [error, setError] = useState(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [newPlan, setNewPlan] = useState({
    plan: "",
    price: "",
    description: [""],
  });
  const [editData, setEditData] = useState({
    plan: "",
    price: "",
    description: [""],
  });

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsModalOpen(true);
  };

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const res = await api.get("/stud-plans/");
        setPlans(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load plans");
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const saveNewPlan = async () => {
    if (!newPlan.plan || !newPlan.price || !newPlan.description.length) {
      showAlert("Please fill all required fields");
      return;
    }
    const payload = {
      plan: newPlan.plan,
      price: parseInt(newPlan.price, 10),
      description: newPlan.description.filter((d) => d.trim() !== ""),
    };
    try {
      const res = await api.post("/stud-plans/create/", payload);
      setPlans((prev) => [...prev, res.data]);
      setNewPlan({ plan: "", price: "", description: [""] });
      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
      showAlert("Failed to create plan");
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setEditData({
      plan: plan.plan,
      price: plan.price,
      description: plan.description || [""],
    });
    setIsEditOpen(true);
  };

  const handleUpdatePlan = async () => {
    if (!editData.plan || !editData.price) {
      showAlert("Please fill all required fields");
      return;
    }

    const payload = {
      plan: editData.plan,
      price: parseInt(editData.price, 10),
      description: editData.description.filter((d) => d.trim() !== ""),
    };

    try {
      // Call backend update API
      const res = await api.put(
        `/stud-plans/${selectedPlan.id}/update/`,
        payload
      );

      // Update local state with returned data
      setPlans((prev) =>
        prev.map((p) => (p.id === selectedPlan.id ? res.data : p))
      );

      setIsEditOpen(false);
      showAlert("Plan updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDeletePlan = async (plan) => {
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPlan) return;

    try {
      // Call the backend delete API
      await api.delete(`/stud-plans/${selectedPlan.id}/delete/`);

      // Update local state
      setPlans((prev) => prev.filter((p) => p.id !== selectedPlan.id));

      // Close modal
      setIsDeleteOpen(false);
    } catch (err) {
      console.error("Delete plan failed:", err);
    }
  };

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    const fetchStudentPayments = async () => {
      try {
        setLoadingPayments(true);
        const res = await api.get("/student-history/");
        console.log(res.data.histories);

        const data = res.data.histories || [];

        const formatted = data.map((item, index) => {
          let date = item.created_at;

          // Convert 'DD-MM-YYYY HH:mm' to 'YYYY-MM-DDTHH:mm'
          if (date) {
            const [day, month, yearAndTime] = date.split("-");
            const [year, time] = yearAndTime.split(" ");
            date = new Date(`${year}-${month}-${day}T${time}:00`);
          } else {
            date = new Date();
          }

          return {
            id: item.id || index,
            student_name:
              item.student_name || item.student?.full_name || "Unknown Tutor",
            plan_name: item.plan_name || item.student_plan_name || "N/A",
            amount: item.price || 0,
            date,
            status: item.status || "pending",
          };
        });

        setPayments(formatted);
      } catch (err) {
        console.error("Failed to load student payments:", err);
        showAlert("Failed to load your payment history");
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchStudentPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon="fas fa-list"
            title="Total Plans"
            value={plans.length}
            color="border-l-emerald-500"
          />
          <StatsCard
            icon="fas fa-credit-card"
            title="Total Payments"
            value={payments.length}
            color="border-l-indigo-500"
          />
          <StatsCard
            icon="fas fa-rupee-sign"
            title="Total Revenue"
            value={`₹${payments.reduce((sum, p) => sum + (p.amount || 0), 0)}`}
            color="border-l-yellow-500"
          />
          <StatsCard
            icon="fas fa-users"
            title="Unique Students"
            value={
              new Set(payments.map((p) => p.student_name || "Unknown")).size
            }
            color="border-l-pink-500"
          />
        </div>

        
      </div>

      <div className="container mx-auto px-4 py-8">
        <PlansTable
          plans={plans}
          onEditPlan={handleEditPlan}
          onDeletePlan={handleDeletePlan}
          onAddPlan={() => setIsAddOpen(true)}
        />
        <PaymentsTable payments={payments} />
      </div>

      {/* Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-gray-80 text-lg font-semibold">
              {alertMessage}
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-emerald-600 text-white px-4 py-2  rounded-lg hover:bg-emerald-700 transition-colors text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ✅ Add Plan Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} size="lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Add New Plan
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Create a new subscription plan for tutors
        </p>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Plan Name"
              value={newPlan.plan}
              onChange={(e) => setNewPlan({ ...newPlan, plan: e.target.value })}
              placeholder="e.g., Premium Plan"
            />

            <InputField
              label="Price (₹)"
              type="number"
              value={newPlan.price}
              onChange={(e) =>
                setNewPlan({ ...newPlan, price: e.target.value })
              }
              placeholder="e.g., 1999"
            />
          </div>

          {/* Bullet point descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="space-y-2">
              {newPlan.description.map((desc, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="text-emerald-600">
                    <i className="fas fa-circle-notch text-xs"></i>
                  </div>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => {
                      const updated = [...newPlan.description];
                      updated[idx] = e.target.value;
                      setNewPlan({ ...newPlan, description: updated });
                    }}
                    placeholder={`Feature ${idx + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {newPlan.description.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const updated = newPlan.description.filter(
                          (_, i) => i !== idx
                        );
                        setNewPlan({ ...newPlan, description: updated });
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <i className="fas fa-times"></i>
                    </motion.button>
                  )}
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setNewPlan({
                    ...newPlan,
                    description: [...newPlan.description, ""],
                  })
                }
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center mt-2"
              >
                <i className="fas fa-plus-circle mr-1"></i>
                Add Another Feature
              </motion.button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsAddOpen(false)}
              className="mr-3 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 5px 15px rgba(5, 150, 105, 0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={saveNewPlan}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Create Plan
            </motion.button>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
              <p className="mb-4 text-gray-80 text-lg font-semibold">
                {alertMessage}
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-emerald-600 text-white px-4 py-2  rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ✅ Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} size="lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Edit Plan</h2>
        <p className="text-gray-500 text-sm mb-6">
          Update the subscription plan details
        </p>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Plan Name"
              value={editData.plan}
              onChange={(e) =>
                setEditData({ ...editData, plan: e.target.value })
              }
              placeholder="e.g., Premium Plan"
            />

            <InputField
              label="Price (₹)"
              type="number"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
              placeholder="e.g., 1999"
            />
          </div>

          {/* Bullet point descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="space-y-2">
              {editData.description.map((desc, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="text-emerald-600">
                    <i className="fas fa-circle-notch text-xs"></i>
                  </div>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => {
                      const updated = [...editData.description];
                      updated[idx] = e.target.value;
                      setEditData({ ...editData, description: updated });
                    }}
                    placeholder={`Feature ${idx + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {editData.description.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const updated = editData.description.filter(
                          (_, i) => i !== idx
                        );
                        setEditData({ ...editData, description: updated });
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <i className="fas fa-times"></i>
                    </motion.button>
                  )}
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setEditData({
                    ...editData,
                    description: [...editData.description, ""],
                  })
                }
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center mt-2"
              >
                <i className="fas fa-plus-circle mr-1"></i>
                Add Another Feature
              </motion.button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsEditOpen(false)}
              className="mr-3 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 5px 15px rgba(5, 150, 105, 0.3)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleUpdatePlan}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-save mr-2"></i>
              Update Plan
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* ✅ Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <div className="text-center py-4">
          <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-2xl"></i>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Delete Plan
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the{" "}
            <span className="font-semibold text-red-600">
              {selectedPlan?.plan}
            </span>{" "}
            plan? This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDeleteOpen(false)}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(239, 68, 68, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={confirmDelete}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Delete Plan
            </motion.button>
          </div>
        </div>
      </Modal>
    </div>
  );
}