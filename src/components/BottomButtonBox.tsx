import React from "react";
import { LuPlus, LuMinus, LuX, LuDivide, LuEqual } from "react-icons/lu";
import { MathJax } from "better-react-mathjax";

import type { OperatorType } from "../types";
import Button, { ButtonLabel } from "./Button";
import { ActionTypes } from "../constants";
import { useDispatch } from "../CalculatorStore";
import { useShift } from "../ShiftProvider";

const BottomButtonBox: React.FC = () => {

  const { isShiftEnabled, toggleShift } = useShift();
  const dispatch = useDispatch();

  const handleAllClearButtonClick = () => {
    dispatch({ type: ActionTypes.ALL_CLEAR });
  };

  const handleClearButtonClick = () => {
    dispatch({ type: ActionTypes.CLEAR });
  };

  const handleDigitButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { innerHTML } = e.currentTarget as HTMLButtonElement; 
    dispatch({ type: ActionTypes.UPDATE_CURRENT_OPERAND, payload: { input: innerHTML }});
  };

  const handleDecimalPointClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch({ type: ActionTypes.UPDATE_CURRENT_OPERAND, payload: { input: "." }});
  };

  const handleOperatorButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const currentTarget = e.currentTarget as HTMLButtonElement;
    const operator = currentTarget.getAttribute("data-operator")! as OperatorType;
    dispatch({ type: ActionTypes.UPDATE_EXPRESSION, payload: { operator }});
  };

  const handleEqualsButtonClick = () => {
    if (isShiftEnabled) {
      dispatch({ type: ActionTypes.PERCENT });
      toggleShift();
    } else {
      dispatch({ type: ActionTypes.EVALUATE_EXPRESSION });
    }
  };

  //console.log("rendering BottomButtonBox");

  return (
    <div className="grid grid-cols-5 grid-rows-4 gap-x-3 gap-y-1">

      {/* Row 1 */}

      <Button onClick={handleDigitButtonClick}>7</Button>
      <Button onClick={handleDigitButtonClick}>8</Button>
      <Button onClick={handleDigitButtonClick}>9</Button>
      <Button className="bg-red-500" onClick={handleClearButtonClick}>C</Button>
      
      <Button className="bg-red-500" onClick={handleAllClearButtonClick}>
        <ButtonLabel>
          Mcl<span className="ml-2 text-neutral-300">ON</span>
        </ButtonLabel>
        AC
      </Button>

      {/* Row 2 */}

      <Button onClick={handleDigitButtonClick}>4</Button>
      <Button onClick={handleDigitButtonClick}>5</Button>
      <Button onClick={handleDigitButtonClick}>6</Button>
      
      <Button operator="*" ariaLabel="multiply" onClick={handleOperatorButtonClick}>
        <ButtonLabel>
          <MathJax>{"`x^y`"}</MathJax>
        </ButtonLabel>
        <LuX />
      </Button>

      <Button operator="/" ariaLabel="divide" onClick={handleOperatorButtonClick}>
        <ButtonLabel>
          <MathJax>
            {"`x`"}
            <span className="relative -top-0.5">
              <span className="relative ml-0.5 -top-0.5 text-[10px]">1</span>/y
            </span>
          </MathJax>
        </ButtonLabel>
        <LuDivide className="relative mt-0.5" />
      </Button>

      <Button onClick={handleDigitButtonClick}>1</Button>
      <Button onClick={handleDigitButtonClick}>2</Button>
      <Button onClick={handleDigitButtonClick}>3</Button>

      <Button operator="+" ariaLabel="plus" onClick={handleOperatorButtonClick}>
        <ButtonLabel>
          <MathJax>
            P<span className="mx-0.5">{"`to`"}</span>R
          </MathJax>
        </ButtonLabel>
        <LuPlus className="relative mt-0.5" />
      </Button>

      <Button operator="-" ariaLabel="minus" onClick={handleOperatorButtonClick}>
        <ButtonLabel>
          <MathJax>
            R<span className="mx-0.5">{"`to`"}</span>P
          </MathJax>
        </ButtonLabel>
        <LuMinus className="relative mt-0.5" />
      </Button>

      {/* Row 3 */}
      
      <Button onClick={handleDigitButtonClick}>
        <ButtonLabel>
          RND
        </ButtonLabel>
        0
      </Button>
      
      <Button ariaLabel="decimal point" onClick={handleDecimalPointClick}>
        <ButtonLabel>
          RAD#
        </ButtonLabel>
        <MathJax>{"`cdot`"}</MathJax>
      </Button>
      
      <Button onClick={() => dispatch({ type: ActionTypes.TODO })}>
        <ButtonLabel>
          <MathJax className="text-sm -mt-1 text-neutral-300">{"`pi`"}</MathJax>
        </ButtonLabel>
        <span className="scale-75">EXP</span>
      </Button>
      
      <Button onClick={() => dispatch({ type: ActionTypes.TODO })}>
        <span className="scale-75">Ans</span>
      </Button>

      <Button 
        ariaLabel={isShiftEnabled ? "percent" : "equals"} 
        onClick={handleEqualsButtonClick}
      >
        <ButtonLabel>
          %
        </ButtonLabel>
        <LuEqual className="relative mt-0.5" />
      </Button>
    </div>
  );
};

export default BottomButtonBox;
