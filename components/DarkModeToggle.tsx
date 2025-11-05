import React, { useEffect, useState } from "react";

const STORAGE_KEY = "supachat_theme";

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved === "dark";
      // default: prefer system
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem(STORAGE_KEY, "light");
    }
  }, [isDark]);

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setIsDark(prev => !prev)}
      className="p-2 rounded-md hover:bg-white/10 transition-colors"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      {isDark ? (
        <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      ) : (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm6.364 3.05a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM21 11a1 1 0 110 2h-1a1 1 0 110-2h1zM7.05 4.636a1 1 0 011.414 0l.707.707A1 1 0 017.757 6.757l-.707-.707a1 1 0 010-1.414zM4 11a1 1 0 110 2H3a1 1 0 110-2h1zM6.343 16.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM12 19a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm6.364-2.05a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0z" /></svg>
      )}
    </button>
  );
};

export default DarkModeToggle;
