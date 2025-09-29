
import React from "react";

export default function SummaryCard({title,data}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[100%] w-[100%]">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ul className="space-y-2">
        {data.map((item,index)=>(
        <li  key= {index} className="flex justify-between">
          <span>{item.label}:</span>
          <span className="font-medium">{item.value}</span>
        </li>
        
          ))}
        
        
      </ul>
    </div>
  );
}
