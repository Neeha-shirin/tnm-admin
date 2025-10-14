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
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Sidebar (hidden on small screens if needed) */}
        {/* <Sidebar /> */}

        <div className="p-4 flex-1 bg-gray-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* Monthly Revenue Card */}
          <div className="col-span-1 sm:col-span-2">
            <MonthlyRevenueCard />
          </div>

          {/* Summary Card */}
          <div className="col-span-1 flex flex-col gap-4 h-full">
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
