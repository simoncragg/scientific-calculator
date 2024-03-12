import React from "react";
import { MathJax } from "better-react-mathjax";

import Button from "./Button";
import { ActionTypes } from "../constants";
import { useDispatch } from "../CalculatorStore";
import { useShift } from "../ShiftProvider";

const TopButtonBox: React.FC = () => {

  const dispatch = useDispatch();
  const { isShiftEnabled, toggleShift } = useShift();
  
  const handleInvertNumberButtonClick = () => {
    dispatch({ type: ActionTypes.INVERT_NUMBER });
  };

  const handleSquareRootButtonClick = () => {
    if (isShiftEnabled) {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "square" } }); 
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "sqrt" } });
    }
  };

  const handleLogButtonClick = () => {
    if (isShiftEnabled) {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "powerOfTen" } });
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "log10" } });
    }
  };

  const handleNaturalLogButtonClick = () => {
    if (isShiftEnabled) {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "exp" } });
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "log" } });
    }
  };

  const handleOffButtonClick = () => {
    dispatch({ 
      type: ActionTypes.ADJUST_VOLTAGE, 
      payload: { voltageLevel: 0.0 }
    });
  };

  const handleDrgModeButtonClick = () => {
    dispatch({ type: ActionTypes.CYCLE_DRG_MODE });
  };

  const handleSineButtonClick = () => {
    if (isShiftEnabled) {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "asin" } });
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "sin" }});
    }
  };
  
  const handleCosineButtonClick = () => {
    if (isShiftEnabled) {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "acos" }});
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "cos" }});
    }
  };

  const handleTangentButtonClick = () => {
    dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "tan" }});
  };

  //console.log("rendering TopButtonBox");

  return (
    <div className="grid grid-cols-6 grid-rows-3 gap-x-2.5 gap-y-1">

      {/* Row 1 */}

      <Button 
        ariaLabel="shift" 
        className="fn" 
        onClick={() => toggleShift()}
        buttonLabel={"SHIFT"}>
        &nbsp;
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "square" : "square root"} 
        className="fn" 
        onClick={() => handleSquareRootButtonClick()}
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
        onClick={handleDrgModeButtonClick}
      >
        <span className="ml-1">DRG▸</span>
      </Button>

      <Button className="fn" onClick={handleOffButtonClick}>
        OFF
      </Button>

      {/* Row 2 */}

      <Button 
        className="fn" 
        onClick={() => dispatch({ type: ActionTypes.TODO })}
        buttonLabel={<><span className="relative ml-0.5 -top-0.5">d</span>/c</>}
      >
        <MathJax>
          <span className="text-lg">{"`a`"}</span>
          <span className="relative ml-0.5 -top-0.5">b</span>/c
        </MathJax>
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch({ type: ActionTypes.TODO })}
        buttonLabel={<MathJax>{"`leftarrow`"}</MathJax>}
      >
        <span className="text-lg ml-0.5 mt-1">°</span>
        <span className="text-2xl ml-0.5 mt-2">’</span>
        <span className="text-2xl ml-0.5 mt-2">”</span>
      </Button>

      <Button className="fn" onClick={() => dispatch({ type: ActionTypes.TODO })}>
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
        ariaLabel="tangent"
        className="fn" 
        onClick={handleTangentButtonClick}
        buttonLabel={<MathJax>{"`tan^-1`"}</MathJax>}
      >
        tan
      </Button>

      {/* Row 3 */}

      <Button 
        className="fn" 
        onClick={handleInvertNumberButtonClick}
        buttonLabel={<MathJax>{"`root(3)(x)`"}</MathJax>}
      >
        +/-
      </Button>
      
      <Button 
        className="fn" 
        onClick={() => dispatch({ type: ActionTypes.TODO })}
        buttonLabel={<MathJax>{"`x^3`"}</MathJax>}
      >
        ►
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch({ type: ActionTypes.TODO })}
        buttonLabel={<MathJax><span className="relative -top-0.5 text-[10px]">1</span>{"/`x`"}</MathJax>}
      >
        (
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch({ type: ActionTypes.TODO })}
        buttonLabel={<MathJax>{"`x!`"}</MathJax>}
      >
        )
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch({ type: ActionTypes.TODO })}
        buttonLabel="Min"
      >
        MR
      </Button>

      <Button 
        className="fn" 
        onClick={() => dispatch({ type: ActionTypes.TODO })}
        buttonLabel={"M-"}
      >
        M+
      </Button>
    </div>
  );
};

export default TopButtonBox;
