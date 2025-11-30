import React from "react";

const Badge = ({ children, color = "blue" }) => {
  const colors = {
      blue: "bg-blue-50 text-blue-700 border-blue-100",
      green: "bg-green-50 text-green-700 border-green-100",
      orange: "bg-orange-50 text-orange-700 border-orange-100",
      purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold border ${colors[color] || colors.blue}`}>
          {children}
      </span>
  );
};

export default Badge;