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

          <div className="col-span-2">
            <BookingTable />
          </div>
          <div className="col-span-1 flex flex-col gap-4 h-[100%]">
            <Messages />
          </div>

          <div className="col-span-1 flex flex-col gap-4 h-[100%]">
            <SummaryCard
              title="sales summary"
              data={[
                { label: "total subjects", value: "4500" },
                { label: "total no of students", value: "4500" },
                { label: "total no of tutors", value: "4500" },
                { label: "category", value: "4500" },
              ]}
            />
          </div>
          


          
        </div>
      </div>
    </div>
  );
}
