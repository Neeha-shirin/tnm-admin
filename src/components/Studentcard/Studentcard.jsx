import React from "react";

const StudentCard = ({ icon, title, value, bgColor = "bg-white", iconBg }) => {
  return (
    <div className={`${bgColor} rounded-xl p-4 shadow-sm border border-gray-100`}>
      <div className="flex items-center">
        <div className={`${iconBg} mr-4 flex items-center justify-center rounded-full`}>
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
