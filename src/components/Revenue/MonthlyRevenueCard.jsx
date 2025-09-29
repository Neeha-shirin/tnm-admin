// src/components/Revenue/MonthlyRevenueCard.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyRevenueCard() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [20, 35, 50, 40, 65, 80],
        borderColor: "#1c8536ff",
        backgroundColor: "rgba(31, 66, 18, 0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#1c8536ff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-[100%]">
      <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
