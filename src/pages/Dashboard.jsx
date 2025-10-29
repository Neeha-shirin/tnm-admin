import React, { useState, useEffect } from "react";
import UserCard from "../components/Card/UserCard";
import Sidebar from "../components/Sidebar/Sidebar";
import MonthlyRevenueCard from "../components/Revenue/MonthlyRevenueCard";
import SummaryCard from "../components/Summary/SummaryCard";
import BookingTable from "../components/Table/BookingTable";
import { FaGraduationCap, FaUserGraduate, FaUserPlus } from "react-icons/fa";
import api from "../api";

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [approvedTutors, setApprovedTutors] = useState([]);
  const [pendingTutors, setPendingTutors] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchTutors();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/students/");
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error fetching student count:", err);
    }
  };

  const fetchTutors = async () => {
    try {
      const allTutorRes = await api.get("/admin/tutors/");
      const allTutors = allTutorRes.data || [];

      setPendingTutors(allTutors.filter((t) => !t.is_approved && !t.is_rejected));

      const approvedRes = await api.get("/admin/tutors/approved/");
      setApprovedTutors(approvedRes.data || []);
    } catch (err) {
      console.error("Error fetching tutor count:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 flex-col lg:flex-row">

        <div className="p-4 w-full bg-gray-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          
          {/* ✅ Dynamic Dashboard Counts */}
          <UserCard
            icon={<FaGraduationCap />}
            title="Total Tutors"
            value={approvedTutors.length}
          />
          <UserCard
            icon={<FaUserGraduate />}
            title="Total Students"
            value={students.length}
          />
          <UserCard
            icon={<FaUserPlus />}
            title="New Leads Today"
            value={pendingTutors.length}
          />

         <div className="col-span-full">
          <MonthlyRevenueCard />
         </div>



          <div className="col-span-1 flex flex-col gap-4 h-full">
            
          </div>
        </div>
      </div>
    </div>
  );
}
