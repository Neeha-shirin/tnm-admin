import { motion } from "framer-motion";

const StatsCard = ({ icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${color} flex items-center justify-between`}
  >
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div
      className={`p-3 rounded-full ${
        color.replace("border-l", "bg").replace("-500", "-100")
      } ${color} text-lg`}
    >
      <i className={icon}></i>
    </div>
  </motion.div>
);

export default StatsCard;
