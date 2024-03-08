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
      dispatch({ type: ActionTypes.SQUARE }); 
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.SQUARE_ROOT }); 
    }
  };

  const handleLogButtonClick = () => {
    if (isShiftEnabled) {
      dispatch({ type: ActionTypes.POWER_OF_TEN });
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.LOG });
    }
  };

  const handleNaturalLogButtonClick = () => {
    if (isShiftEnabled) {
      dispatch({ type: ActionTypes.EXP_X });
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.NATURAL_LOG });
    }
  };

  console.log("rendering TopButtonBox");

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

      <Button className="fn" onClick={() => null}>
        <span className="ml-1">DRG▸</span>
      </Button>

      <Button className="fn" onClick={() => null}>
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

      <Button className="fn" onClick={() => null}>
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
