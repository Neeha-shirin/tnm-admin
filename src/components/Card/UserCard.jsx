import { Card } from "flowbite-react";

export const UserCard = ({ icon, title, value }) => {
  return (
    <div className="w-full max-w-xs ">
      <Card
        className="flex flex-col items-center shadow-md hover:shadow-2xl text-center p-4 
                   transition-all duration-300 rounded-2xl border border-gray-100 bg-white 
                   transform hover:-translate-y-1 hover:scale-105 h-[90%]"
      >
        {/* Icon */}
        <div className="text-green-600 text-3xl animate-bounce flex justify-center">
          {icon}
        </div>

        {/* Title */}
        <p className="text-base font-medium text-gray-600 text-center">
          {title}
        </p>

        {/* Value */}
        <h2 className="text-3xl font-extrabold text-gray-900">
          {value}
        </h2>
      </Card>
    </div>
  );
};

export default UserCard;
