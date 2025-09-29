import React from "react";

export default function BookingTable() {
  const bookings = [
    { id: "B001", tutor: "Tutor A", student: "W", date: "12 Apr 2024" },
    { id: "B002", tutor: "Tutor B", student: "X", date: "12 Apr 2024" },
    { id: "B003", tutor: "Tutor C", student: "Y", date: "12 Apr 2024" },
    { id: "B004", tutor: "Tutor D", student: "Z", date: "19 Apr 2024" },
    { id: "B005", tutor: "Tutor E", student: "E", date: "13 Apr 2024" },
    
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[100%]">
      <h2 className="text-lg font-semibold mb-4">Booking Blokes</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="p-2">Booking ID</th>
              <th className="p-2">Tutor Name</th>
              <th className="p-2">Student Name</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={booking.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-2">{booking.id}</td>
                <td className="p-2">{booking.tutor}</td>
                <td className="p-2">{booking.student}</td>
                <td className="p-2">{booking.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}