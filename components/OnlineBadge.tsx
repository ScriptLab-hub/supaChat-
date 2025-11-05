import React from "react";

const OnlineBadge: React.FC<{ online?: boolean }> = ({ online = false }) => {
  return (
    <span className="relative inline-flex h-3 w-3">
      <span className={`absolute inline-flex h-3 w-3 rounded-full ${online ? "bg-emerald-400" : "bg-gray-400"} ring-2 ring-white dark:ring-zinc-900`}></span>
      {online && <span className="online-badge" aria-hidden />}
    </span>
  );
};

export default OnlineBadge;
