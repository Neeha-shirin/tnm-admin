// src/pages/Dashboard.jsx
import React from "react";
import UserCard from "../components/Card/UserCard";

import Sidebar from "../components/Sidebar/Sidebar";
import MonthlyRevenueCard from "../components/Revenue/MonthlyRevenueCard";
import SummaryCard from "../components/Summary/SummaryCard";
import BookingTable from "../components/Table/BookingTable";

import { FaGraduationCap, FaUserGraduate, FaUserPlus } from "react-icons/fa";
import Messages from "../components/Chat/Messages";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen ">
    
      <div className="flex flex-1 ">
        {/* Sidebar on the left */}
        

        <div className="p-4 flex-1 bg-gray-10 grid grid-cols-3 gap-4 ">
          {/* User Cards */}
          <UserCard
            icon={<FaGraduationCap />}
            title="Total Tutors"
            value="1,200"
          />
          <UserCard
            icon={<FaUserGraduate />}
            title="Total Students"
            value="3,450"
          />
          <UserCard
            icon={<FaUserPlus />}
            title="New Leads Today"
            value="58"
          />

          <div className="col-span-2">
            <MonthlyRevenueCard />
          </div>

          <div className="col-span-1 flex flex-col gap-4 h-[100%]">
            <SummaryCard
              title="sales summary"
              data={[
                { label: "total sales", value: "4500" },
                { label: "new leads ", value: "4500" },
                { label: "follow up", value: "4500" },
                { label: "convented leads", value: "4500" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}



// src/pages/Dashboard.jsx
// import React from "react";
// import UserCard from "../components/Card/UserCard";
// import { FaGraduationCap, FaUserGraduate, FaUserPlus, FaDollarSign, FaChartLine, FaShoppingCart, FaUsers, FaCheckCircle } from "react-icons/fa";

// export default function Dashboard() {
//   return (
//     <div className="flex flex-col h-screen">
//       <div className="flex flex-1">
//         <div className="p-4 flex-1 bg-gray-10 grid grid-cols-3 gap-4">
//           {/* User Cards - Your component cards */}
//           <UserCard
//             icon={<FaGraduationCap />}
//             title="Total Tutors"
//             value="1,200"
//           />
//           <UserCard
//             icon={<FaUserGraduate />}
//             title="Total Students"
//             value="3,450"
//           />
//           <UserCard
//             icon={<FaUserPlus />}
//             title="New Leads Today"
//             value="58"
//           />

//           {/* Monthly Revenue Card - spans 2 columns */}
//           <div className="col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-3xl font-bold text-gray-800">$24,500</p>
//                 <p className="text-green-500 flex items-center mt-2">
//                   <FaChartLine className="mr-1" />
//                   +12.5% from last month
//                 </p>
//               </div>
//               <div className="text-4xl text-blue-500">
//                 <FaDollarSign />
//               </div>
//             </div>
//             {/* Simple bar chart representation */}
//             <div className="mt-6 flex items-end space-x-2 h-24">
//               {[40, 60, 75, 90, 65, 80, 95, 70, 85, 100, 85, 95].map((height, index) => (
//                 <div
//                   key={index}
//                   className="flex-1 bg-blue-200 rounded-t hover:bg-blue-300 transition-colors"
//                   style={{ height: `${height}%` }}
//                 ></div>
//               ))}
//             </div>
//           </div>

//           {/* Sales Summary Card - spans 1 column */}
//           <div className="col-span-1 flex flex-col gap-4 h-[100%]">
//             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4 uppercase">Sales Summary</h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
//                   <span className="text-gray-600 text-sm">Total Sales</span>
//                   <span className="font-semibold text-gray-800">4,500</span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
//                   <span className="text-gray-600 text-sm">New Leads</span>
//                   <span className="font-semibold text-gray-800">58</span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
//                   <span className="text-gray-600 text-sm">Follow Up</span>
//                   <span className="font-semibold text-gray-800">1,200</span>
//                 </div>
//                 <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
//                   <span className="text-gray-600 text-sm">Converted Leads</span>
//                   <span className="font-semibold text-gray-800">850</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Additional Cards Row */}
//           <div className="col-span-3 grid grid-cols-3 gap-4 mt-4">
//             {/* Recent Bookings */}
//             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
//               <div className="space-y-3">
//                 {['Math Tutoring', 'Science Class', 'English Lesson', 'Coding Workshop'].map((subject, index) => (
//                   <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
//                     <span className="text-gray-600">{subject}</span>
//                     <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Booked</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Performance Metrics */}
//             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance</h3>
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-500">89%</div>
//                   <div className="text-gray-600 text-sm">Success Rate</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-blue-500">24h</div>
//                   <div className="text-gray-600 text-sm">Avg Response Time</div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <FaUsers className="text-gray-400 mr-2" />
//                     <span className="text-gray-600">Active Sessions</span>
//                   </div>
//                   <span className="font-semibold">42</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <FaShoppingCart className="text-gray-400 mr-2" />
//                     <span className="text-gray-600">Pending</span>
//                   </div>
//                   <span className="font-semibold">18</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <FaCheckCircle className="text-gray-400 mr-2" />
//                     <span className="text-gray-600">Completed</span>
//                   </div>
//                   <span className="font-semibold">156</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }