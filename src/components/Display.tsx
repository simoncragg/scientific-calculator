import { useState, useEffect } from "react";

import OperatorIndicator from "./OperatorIndicator";
import { useCalcState } from "../CalculatorStore";

const Display = () => {
  const { output, lastInput, voltageLevel } = useCalcState();
  const [showEqualsIndicator, setShowEqualsIndicator] = useState(false);

  useEffect(() => {
    setShowEqualsIndicator(lastInput === "=");
  }, [lastInput]);

  return (
    <div className="relative flex w-full h-20 items-center justify-end mb-3 bg-[#687] font-sans rounded shadow-inner shadow-black overflow-hidden">
      
      <OperatorIndicator />

      {showEqualsIndicator && (
        <span 
          data-testid="equals-indicator"
          aria-label="Equals sign"
          className="absolute -top-[7px] left-2 text-3xl text-stone-800"
          style={{ opacity: voltageLevel }}
        >
            =
          </span>
      )}

      <span 
        data-testid="output" 
        className="leading-none self-end pr-5 text-stone-800 text-[45px] whitespace-nowrap" 
        style={{ opacity: voltageLevel }}>
        {output}
      </span>
      
    </div>
  );
};

export default Display;
