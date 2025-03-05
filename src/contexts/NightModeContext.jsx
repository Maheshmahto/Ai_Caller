import React, { createContext, useState, useContext, useEffect } from "react";

// Create Context for Night Mode
const NightModeContext = createContext();

// Create a provider component
export const NightModeProvider = ({ children }) => {
  const [isNightMode, setIsNightMode] = useState(false);

  // Apply night mode styles to body element
  useEffect(() => {
    if (isNightMode) {
      document.body.classList.add("bg-gray-800", "text-white");
      document.body.classList.remove("bg-gray-50", "text-gray-800");
    } else {
      document.body.classList.remove("bg-gray-800", "text-white");
      document.body.classList.add("bg-gray-50", "text-gray-800");
    }
  }, [isNightMode]);

  // Toggle Night Mode
  const toggleNightMode = () => {
    setIsNightMode((prevMode) => !prevMode);
  };

  return (
    <NightModeContext.Provider value={{ isNightMode, toggleNightMode }}>
      {children}
    </NightModeContext.Provider>
  );
};

// Custom hook to use NightModeContext
export const useNightMode = () => {
  return useContext(NightModeContext);
};
