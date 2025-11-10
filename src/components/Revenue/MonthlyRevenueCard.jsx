// src/components/Revenue/MonthlyRevenueCard.jsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MonthlyRevenueCard() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Revenue",
        data: [20, 35, 50, 40, 65, 80, 75, 90, 85, 95, 88, 98],
        borderColor: "#1c8536",
        backgroundColor: "linear-gradient(180deg, rgba(28, 133, 54, 0.2) 0%, rgba(28, 133, 54, 0.05) 100%)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#1c8536",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#1c8536",
        pointHoverBorderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: false 
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `Revenue: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => `${value}%`,
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear'
      }
    },
  };

  const gradient = document.createElement('canvas').getContext('2d');
  const chartGradient = gradient.createLinearGradient(0, 0, 0, 400);
  chartGradient.addColorStop(0, 'rgba(28, 133, 54, 0.2)');
  chartGradient.addColorStop(1, 'rgba(28, 133, 54, 0.02)');

  // Apply gradient to dataset
  data.datasets[0].backgroundColor = chartGradient;

  return (
    <div className="w-full">
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">98%</p>
          <p className="text-sm text-gray-500">Current</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">+78%</p>
          <p className="text-sm text-gray-500">Growth</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">12M</p>
          <p className="text-sm text-gray-500">Target</p>
        </div>
      </div>
    </div>
  );
}