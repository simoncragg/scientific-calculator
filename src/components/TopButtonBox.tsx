import React from "react";
import { MathJax } from "better-react-mathjax";
import { useAppDispatch, useAppSelector } from "../hooks";

import { FunctionType } from "../types";
import Button from "./Button";

import {
  adjustVoltage,
  cycleDrgMode,
  executeFunction,
  invertNumber,
  todo,
  toggleShift,
} from "../calcSlice";

const TopButtonBox: React.FC = () => {

  const dispatch = useAppDispatch();
  const isShiftEnabled = useAppSelector(state => state.calc.isShiftEnabled);
  
  const handleFunctionButtonClick = (primary: FunctionType, secondary: FunctionType) => {
    if (!isShiftEnabled) {
      dispatch(executeFunction({ func: primary}));
    } else {
      dispatch(executeFunction({ func: secondary})); 
      dispatch(toggleShift());
    }
  };

  //console.log("rendering TopButtonBox");

  return (
    <div className="grid grid-cols-6 grid-rows-3 gap-x-2.5 gap-y-1">

      {/* Row 1 */}

      <Button 
        ariaLabel="shift" 
        className="fn" 
        onClick={() => dispatch(toggleShift())}
        buttonLabel={"SHIFT"}>
        &nbsp;
      </Button>

      <Button 
        ariaLabel={!isShiftEnabled ? "square root" : "square"} 
        className="fn" 
        onClick={() => handleFunctionButtonClick("sqrt", "square")}
        buttonLabel={<MathJax>{"`x^2`"}</MathJax>}
      >
        <MathJax className="scale-75">{"`root()(x)`"}</MathJax>
      </Button>

      <Button 
        ariaLabel={!isShiftEnabled ? "log" : "power of ten"}
        className="fn"
        onClick={() => handleFunctionButtonClick("log10", "powerOfTen")}
        buttonLabel={<MathJax>{"`10^x`"}</MathJax>}
      >
        log
      </Button>

      <Button 
        ariaLabel={!isShiftEnabled ? "natural log" : "exp x" }
        className="fn" 
        onClick={() => handleFunctionButtonClick("log", "exp")}
        buttonLabel={<MathJax>{"`e^x`"}</MathJax>}
      >
        ln
      </Button>

      <Button 
        ariaLabel="angle mode"
        className="fn" 
        onClick={() => dispatch(cycleDrgMode())}
      >
        <span className="ml-1">DRG▸</span>
      </Button>

      <Button className="fn" onClick={() => dispatch(adjustVoltage({ voltageLevel: 0.0 }))}>
        OFF
      </Button>

      {/* Row 2 */}

      <Button 
        className="fn" 
        onClick={() => dispatch(todo())}
        buttonLabel={<><span className="relative ml-0.5 -top-0.5">d</span>/c</>}
      >
        <MathJax>
          <span className="text-lg">{"`a`"}</span>
          <span className="relative ml-0.5 -top-0.5">b</span>/c
        </MathJax>
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch(todo())}
        buttonLabel={<MathJax>{"`leftarrow`"}</MathJax>}
      >
        <span className="text-lg ml-0.5 mt-1">°</span>
        <span className="text-2xl ml-0.5 mt-2">’</span>
        <span className="text-2xl ml-0.5 mt-2">”</span>
      </Button>

      <Button className="fn" onClick={() => dispatch(todo())}>
        hyp
      </Button>

      <Button 
        ariaLabel={!isShiftEnabled ? "sine" : "arc sine"}
        className="fn" 
        onClick={() => handleFunctionButtonClick("sin", "asin")}
        buttonLabel={<MathJax>{"`sin^-1`"}</MathJax>}
      >
        sin
      </Button>

      <Button 
        ariaLabel={!isShiftEnabled ? "cosine" : "arc cosine"}
        className="fn" 
        onClick={() => handleFunctionButtonClick("cos", "acos")}
        buttonLabel={<MathJax>{"`cos^-1`"}</MathJax>}
        >
        cos
      </Button>

      <Button 
        ariaLabel={!isShiftEnabled ? "tangent" : "arc tangent"}
        className="fn" 
        onClick={() => handleFunctionButtonClick("tan", "atan")}
        buttonLabel={<MathJax>{"`tan^-1`"}</MathJax>}
      >
        tan
      </Button>

      {/* Row 3 */}

      <Button 
        className="fn" 
        onClick={() => dispatch(invertNumber())}
        buttonLabel={<MathJax>{"`root(3)(x)`"}</MathJax>}
      >
        +/-
      </Button>
      
      <Button 
        className="fn" 
        onClick={() => dispatch(todo())}
        buttonLabel={<MathJax>{"`x^3`"}</MathJax>}
      >
        ►
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch(todo())}
        buttonLabel={<MathJax><span className="relative -top-0.5 text-[10px]">1</span>{"/`x`"}</MathJax>}
      >
        (
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch(todo())}
        buttonLabel={<MathJax>{"`x!`"}</MathJax>}
      >
        )
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch(todo())}
        buttonLabel="Min"
      >
        MR
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch(todo())}
        buttonLabel={"M-"}
      >
        M+
      </Button>
    </div>
  );
};

export default TopButtonBox;
