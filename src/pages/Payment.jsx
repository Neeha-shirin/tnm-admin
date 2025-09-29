import "@fortawesome/fontawesome-free/css/all.min.css";
import { getPlans, createPlan, updatePlan, deletePlan } from "../planApi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import StatsCard from "../components/StatsCard"; 


// ✅ Reusable Modal Component with Animation
const Modal = ({ isOpen, onClose, children, size = "md" }) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
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

// Header
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



// Plans Table
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
        whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(5, 150, 105, 0.2)" }}
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
            <th className="py-4 px-6 font-medium">Duration</th>
            <th className="py-4 px-6 font-medium">Description</th>
            <th className="py-4 px-6 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {plans.map((plan, idx) => (
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
                  <span className="font-semibold text-emerald-700">₹{plan.price}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {plan.duration_value} {plan.duration_unit}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {plan.description.map((point, i) => (
                      <li key={i} className="mb-1">{point}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1, boxShadow: "0 0 8px rgba(59, 130, 246, 0.4)" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEditPlan(plan)}
                      className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <i className="fas fa-edit"></i>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, boxShadow: "0 0 8px rgba(239, 68, 68, 0.4)" }}
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

// Payments Table
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
            <th className="py-4 px-6 font-medium">Tutor</th>
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
                  <span className="font-medium">{pay.tutor_name}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {pay.plan_name}
                </span>
              </td>
              <td className="py-4 px-6 font-semibold text-gray-800">₹{pay.amount}</td>
              <td className="py-4 px-6 text-gray-600">
                {new Date(pay.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                  <i className={`fas ${pay.status === "paid" ? "fa-check-circle" : "fa-clock"} mr-1`}></i>
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

// Input Field Component
const InputField = ({ label, type = "text", value, onChange, placeholder, className = "" }) => (
  <div className={className}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
    />
  </div>
);

// Main Component
export default function Payment() {
  const [plans, setPlans] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchPlans();
}, []);

const fetchPlans = async () => {
  try {
    setLoading(true);
    const res = await getPlans();
    setPlans(res.data); // assumes API returns an array of plans
  } catch (err) {
    console.error(err);
    alert("Failed to load plans");
  } finally {
    setLoading(false);
  }
};


  const payments = [
    { id: 1, tutor_name: "John Doe", plan_name: "Pro", amount: 1299, date: "2025-09-01", status: "paid" },
    { id: 2, tutor_name: "Jane Smith", plan_name: "Basic", amount: 499, date: "2025-08-28", status: "pending" },
    { id: 3, tutor_name: "Rahul Kumar", plan_name: "Premium", amount: 3999, date: "2025-08-20", status: "paid" },
    { id: 4, tutor_name: "Priya Sharma", plan_name: "Pro", amount: 1299, date: "2025-08-15", status: "paid" },
  ];

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  
  const [newPlan, setNewPlan] = useState({
  plan: "",
  price: "",
  duration_value: "",
  duration_unit: "month", // sensible default
  description: [""],
});

const [editData, setEditData] = useState({
  plan: "",
  price: "",
  duration_value: "",
  duration_unit: "month",
  description: [""],
});


  // Calculate stats
    // -- after this existing code:
  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

 // build dynamic card data
 const stats = [
   {
     icon: "fas fa-wallet",
     title: "Total Revenue",
     value: `₹${totalRevenue.toLocaleString("en-IN")}`,
     color: "border-l-emerald-500",
   },
   {
     icon: "fas fa-users",
     title: "Active Plans",
     value: plans.length,
     color: "border-l-blue-500",
   },
   {
     icon: "fas fa-clock",
     title: "Pending Payments",
    value: pendingPayments,
     color: "border-l-amber-500",
   },
 ];


  const handleAddPlan = () => setIsAddOpen(true);

  const saveNewPlan = async () => {
  if (!newPlan.plan || !newPlan.price || !newPlan.duration_value || !newPlan.duration_unit) {
    alert("Please fill all required fields");
    return;
  }

  const payload = {
  plan: newPlan.plan,
  price: parseInt(newPlan.price, 10),
  duration: `${newPlan.duration_value} ${newPlan.duration_unit}`,
  description: newPlan.description.filter(d => d.trim() !== "")
};


  try {
    const res = await createPlan(payload);
    setPlans((prev) => [...prev, res.data]);

    // reset
    setNewPlan({ plan: "", price: "", duration_value: "", duration_unit: "month", description: [""] });

    setIsAddOpen(false);
  } catch (error) {
    console.error("Failed to create plan", error.response?.data || error);
    alert("Failed to create plan: " + JSON.stringify(error.response?.data));
  }
};



 const handleEditPlan = (plan) => {
  setSelectedPlan(plan);
  setEditData({
    plan: plan.plan,
    price: plan.price,
    duration_value: plan.duration_value,
    duration_unit: plan.duration_unit,
    description: plan.description || [],
  });
  setIsEditOpen(true);
};


const handleUpdatePlan = async () => {
  if (!editData.plan || !editData.price || !editData.duration_value || !editData.duration_unit) {
    alert("Please fill all required fields");
    return;
  }

  const payload = {
  plan: editData.plan,
  price: parseInt(editData.price, 10),
  duration: `${editData.duration_value} ${editData.duration_unit}`,
  description: editData.description.filter((d) => d.trim() !== ""),
};

await updatePlan(selectedPlan.id, payload);

  try {
    const res = await updatePlan(selectedPlan.id, payload);

    // ✅ Update state immediately (no refetch needed)
    setPlans((prev) => prev.map((p) => (p.id === selectedPlan.id ? res.data : p)));

    setIsEditOpen(false);
  } catch (error) {
    console.error("Failed to update plan", error.response?.data || error);
    alert("Failed to update plan: " + JSON.stringify(error.response?.data));
  }
};



  const handleDeletePlan = (plan) => {
    setSelectedPlan(plan);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
  try {
    await deletePlan(selectedPlan.id);
    fetchPlans(); // refresh list from API
    setIsDeleteOpen(false);
  } catch (err) {
    console.error(err);
    alert("Failed to delete plan");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">


        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((s, i) => (
            <StatsCard key={i} {...s} />
          ))}
        </div>

        
        <PlansTable 
          plans={plans} 
          onEditPlan={handleEditPlan} 
          onDeletePlan={handleDeletePlan} 
          onAddPlan={handleAddPlan} 
        />
        
        <PaymentsTable payments={payments} />
      </div>

      {/* ✅ Add Plan Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} size="lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Add New Plan</h2>
        <p className="text-gray-500 text-sm mb-6">Create a new subscription plan for tutors</p>
        
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
              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
              placeholder="e.g., 1999"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Duration Value"
              type="number"
              value={newPlan.duration_value ?? ""}
              onChange={(e) =>
                setNewPlan({
                  ...newPlan,
                  duration_value: parseInt(e.target.value) || ""
                })
              }
              placeholder="e.g., 3"
            />
            <div>
              <label className="block text-sm font-medium  text-gray-700 mb-1 ">
                Duration Unit
              </label>
              <select
                value={newPlan.duration_unit || "month"}
                onChange={(e) =>
                  setNewPlan({
                    ...newPlan,
                    duration_unit: e.target.value
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              >
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>






          {/* Bullet point descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
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
                        const updated = newPlan.description.filter((_, i) => i !== idx);
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
                  setNewPlan({ ...newPlan, description: [...newPlan.description, ""] })
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
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(5, 150, 105, 0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={saveNewPlan}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Create Plan
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* ✅ Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} size="lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Edit Plan</h2>
        <p className="text-gray-500 text-sm mb-6">Update the subscription plan details</p>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Plan Name"
              value={editData.plan}
              onChange={(e) => setEditData({ ...editData, plan: e.target.value })}
              placeholder="e.g., Premium Plan"
            />

            <InputField
              label="Price (₹)"
              type="number"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              placeholder="e.g., 1999"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
  <InputField
    label="Duration Value"
    type="number"
    value={editData.duration_value ?? ""}
    onChange={(e) =>
      setEditData({
        ...editData,
        duration_value: parseInt(e.target.value) || ""
      })
    }
    placeholder="e.g., 3"
  />
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Duration Unit
    </label>
    <select
      value={editData.duration_unit || "month"}
      onChange={(e) =>
        setEditData({
          ...editData,
          duration_unit: e.target.value
        })
      }
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
    >
      <option value="day">Day</option>
      <option value="month">Month</option>
      <option value="year">Year</option>
    </select>
  </div>
</div>



          {/* Bullet point descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
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
                        const updated = editData.description.filter((_, i) => i !== idx);
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
                  setEditData({ ...editData, description: [...editData.description, ""] })
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
              whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(5, 150, 105, 0.3)" }}
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
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Delete Plan</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the{" "}
            <span className="font-semibold text-red-600">{selectedPlan?.plan}</span>
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
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(239, 68, 68, 0.3)" }}
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