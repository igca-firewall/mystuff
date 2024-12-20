"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "../ui/button";



const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = React.useState(theme === "dark");
  const [waveActive, setWaveActive] = React.useState(false);

  React.useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setWaveActive(true);
    setTimeout(() => {
      setTheme(isDark ? "light" : "dark");
      setWaveActive(false);
    }, 2000); // The duration of the wave animation
  };

  return (
    <div className="relative inline-block bottom-5 z-0 left-3">
      <Button
        className={`relative w-12 h-6  rounded-full focus:outline-none transition-colors duration-500 ${
          isDark ? "bg-neutral-700" : "bg-neutral-300"
        }`}
        onClick={toggleTheme}
      >
        <div
          className={`absolute inset-y-0 left-0 m-auto h-6 w-6 rounded-full bg-neutral-500 flex items-center justify-center transform transition-transform duration-300 ${
            isDark ? "translate-x-6" : ""
          }`}
        >
          {isDark ? (
          <FaSun />
            
          ) : (
            <FaMoon color="text-orange-500"/>
            
          )}
        </div>
      </Button>
      {waveActive && (
        <div className="wave-overlay absolute inset-0"></div>
      )}
    </div>
  );
};

export default DarkModeToggle;
