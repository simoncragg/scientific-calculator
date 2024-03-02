import React, { createContext, useContext, useState } from "react";
import type { ShiftState } from "./types";

interface ShiftProvider {
  children: React.ReactNode;
}

const ShiftContext = createContext({} as ShiftState);

export const ShiftProvider = ({
  children,
}: ShiftProvider) => {
  
  const [isShiftEnabled, setIsShiftEnabled] = useState(false);
  
  return (
    <ShiftContext.Provider value={{isShiftEnabled, toggleShift: () => setIsShiftEnabled(!isShiftEnabled) }}>
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => useContext(ShiftContext);
