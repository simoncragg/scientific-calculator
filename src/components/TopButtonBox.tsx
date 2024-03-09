import React from "react";
import { MathJax } from "better-react-mathjax";

import Button, { ButtonLabel } from "./Button";
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

  const handleSinButtonClick = () => {
    dispatch({ type: ActionTypes.EXECUTE_FUNCTION, payload: { func: "sin" }});
  };

  //console.log("rendering TopButtonBox");

  return (
    <div className="grid grid-cols-6 grid-rows-3 gap-x-2.5 gap-y-1">

      {/* Row 1 */}

      <Button ariaLabel="shift" className="fn" onClick={() => toggleShift()}>
        <ButtonLabel>SHIFT</ButtonLabel>
        &nbsp;
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "square" : "square root"} 
        className="fn" 
        onClick={() => handleSquareRootButtonClick()}
      >
        <ButtonLabel>
          <MathJax>{"`x^2`"}</MathJax>
        </ButtonLabel>
        <MathJax className="scale-75">{"`root()(x)`"}</MathJax>
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "power of ten" : "log"}
        className="fn"
        onClick={handleLogButtonClick}
      >
        <ButtonLabel>
          <MathJax>{"`10^x`"}</MathJax>
        </ButtonLabel>
        log
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "exp x" : "natural log"}
        className="fn" 
        onClick={handleNaturalLogButtonClick}
      >
        <ButtonLabel>
          <MathJax>{"`e^x`"}</MathJax>
        </ButtonLabel>
        ln
      </Button>

      <Button 
        ariaLabel="drg mode"
        className="fn" 
        onClick={handleDrgModeButtonClick}
      >
        <span className="ml-1">DRG▸</span>
      </Button>

      <Button className="fn" onClick={handleOffButtonClick}>
        OFF
      </Button>

      {/* Row 2 */}

      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          <span className="relative ml-0.5 -top-0.5">d</span>/c
        </ButtonLabel>
        <MathJax>
          <span className="text-lg">{"`a`"}</span>
          <span className="relative ml-0.5 -top-0.5">b</span>/c
        </MathJax>
      </Button>

      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          <MathJax>{"`leftarrow`"}</MathJax>
        </ButtonLabel>
        <span className="text-lg ml-0.5 mt-1">°</span>
        <span className="text-2xl ml-0.5 mt-2">’</span>
        <span className="text-2xl ml-0.5 mt-2">”</span>
      </Button>

      <Button className="fn" onClick={() => null}>
        hyp
      </Button>

      <Button 
        ariaLabel="sin"
        className="fn" 
        onClick={handleSinButtonClick}>
        <ButtonLabel>
          <MathJax>{"`sin^-1`"}</MathJax>
        </ButtonLabel>
        sin
      </Button>

      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          <MathJax>{"`cos^-1`"}</MathJax>
        </ButtonLabel>
        cos
      </Button>

      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          <MathJax>{"`tan^-1`"}</MathJax>
        </ButtonLabel>
        tan
      </Button>

      {/* Row 3 */}

      <Button className="fn" onClick={handleInvertNumberButtonClick}>
        <ButtonLabel>
          <MathJax>{"`root(3)(x)`"}</MathJax>
        </ButtonLabel>
        +/-
      </Button>
      
      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          <MathJax>{"`x^3`"}</MathJax>
        </ButtonLabel>
        ►
      </Button>

      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          <MathJax><span className="relative -top-0.5 text-[10px]">1</span>{"/`x`"}</MathJax>
        </ButtonLabel>
        (
      </Button>

      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          <MathJax>{"`x!`"}</MathJax>
        </ButtonLabel>
        )
      </Button>

      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          Min
        </ButtonLabel>
        MR
      </Button>

      <Button className="fn" onClick={() => null}>
        <ButtonLabel>
          M-
        </ButtonLabel>
        M+
      </Button>
    </div>
  );
};

export default TopButtonBox;
