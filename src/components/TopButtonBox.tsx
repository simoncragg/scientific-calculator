import React from "react";
import { MathJax } from "better-react-mathjax";
import { useAppDispatch, useAppSelector } from "../hooks";

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
  
  const handleSquareRootButtonClick = () => {
    if (isShiftEnabled) {
      dispatch(executeFunction({ func: "square"})); 
      dispatch(toggleShift());
    } else {
      dispatch(executeFunction({ func: "sqrt"}));
    }
  };

  const handleLogButtonClick = () => {
    if (isShiftEnabled) {
      dispatch(executeFunction({ func: "powerOfTen"}));
      dispatch(toggleShift());
    } else {
      dispatch(executeFunction({ func: "log10"}));
    }
  };

  const handleNaturalLogButtonClick = () => {
    if (isShiftEnabled) {
      dispatch(executeFunction({ func: "exp"}));
      dispatch(toggleShift());
    } else {
      dispatch(executeFunction({ func: "log"}));
    }
  };

  const handleSineButtonClick = () => {
    if (isShiftEnabled) {
      dispatch(executeFunction({ func: "asin"}));
      dispatch(toggleShift());
    } else {
      dispatch(executeFunction({ func: "sin"}));
    }
  };
  
  const handleCosineButtonClick = () => {
    if (isShiftEnabled) {
      dispatch(executeFunction({ func: "acos"}));
      dispatch(toggleShift());
    } else {
      dispatch(executeFunction({ func: "cos"}));
    }
  };

  const handleTangentButtonClick = () => {
    if (isShiftEnabled) {
      dispatch(executeFunction({ func: "atan"}));
      dispatch(toggleShift());
    } else {
      dispatch(executeFunction({ func: "tan"}));
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
        ariaLabel={isShiftEnabled ? "square" : "square root"} 
        className="fn" 
        onClick={handleSquareRootButtonClick}
        buttonLabel={<MathJax>{"`x^2`"}</MathJax>}
      >
        <MathJax className="scale-75">{"`root()(x)`"}</MathJax>
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "power of ten" : "log"}
        className="fn"
        onClick={handleLogButtonClick}
        buttonLabel={<MathJax>{"`10^x`"}</MathJax>}
      >
        log
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "exp x" : "natural log"}
        className="fn" 
        onClick={handleNaturalLogButtonClick}
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
        ariaLabel={isShiftEnabled ? "arc sine" : "sine"}
        className="fn" 
        onClick={handleSineButtonClick}
        buttonLabel={<MathJax>{"`sin^-1`"}</MathJax>}
      >
        sin
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "arc cosine" : "cosine"}
        className="fn" 
        onClick={handleCosineButtonClick}
        buttonLabel={<MathJax>{"`cos^-1`"}</MathJax>}
        >
        cos
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "arc tangent" : "tangent"}
        className="fn" 
        onClick={handleTangentButtonClick}
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
