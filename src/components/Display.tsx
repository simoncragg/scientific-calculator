import React, { useState, useEffect } from "react";
import OperatorIndicator from "./OperatorIndicator";
import { useCalcState } from "../CalculatorStore";
import { useShift } from "../ShiftProvider";

const Display: React.FC = () => {
  const { output, voltageLevel, lastInput } = useCalcState();
  const { isShiftEnabled } = useShift();
  const [showEqualsIndicator, setShowEqualsIndicator] = useState(false);

  useEffect(() => {
    setShowEqualsIndicator(lastInput === "=");
  }, [lastInput]);

  console.log("rendering Display");

  return (
    <div className="relative flex w-[307px] h-20 items-center justify-end mb-3 bg-[#687] font-sans rounded shadow-inner shadow-black overflow-hidden">
      
      <OperatorIndicator />

      {showEqualsIndicator && (
        <span 
          aria-label="equals indicator"
          className="absolute -top-[7px] left-2 text-3xl text-stone-800"
          style={{ opacity: voltageLevel }}
        >
            =
          </span>
      )}

      {isShiftEnabled && (
        <span 
          aria-label="shift indicator"
          className="leading-none absolute top-1.5 right-14 px-0.5 text-xs text-[#687] bg-stone-800 rounded-sm"
          style={{ opacity: voltageLevel }}
        >
            S
          </span>
      )}

      <span 
        data-testid="output" 
        className="leading-none self-end text-stone-800 text-[45px]" 
        style={{ opacity: voltageLevel }}>
          <div className="pr-7">
            <span className="pr-0.5">{output}</span>
          </div>
      </span>
      
    </div>
  );
};

export default Display;
