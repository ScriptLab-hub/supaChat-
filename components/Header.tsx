import React from "react";
import { useAuth } from "./AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-md">
          💬
        </div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
          SupaChat<span className="text-emerald-500">+</span>
        </h1>
      </div>

      {user ? (
        <button
          onClick={logout}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-all active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          Sign Out
        </button>
      ) : (
        <span className="text-sm text-gray-400 dark:text-gray-500 italic">
          Not signed in
        </span>
      )}
    </header>
  );
};

export default Header;
