import React, { createContext, useContext, useReducer } from "react";

import type { Action, CalcState } from "./types";
import calcReducer from "./reducers/calcReducer";

interface CalculatorStoreProvider {
  children: React.ReactNode;
}

const DispatchContext = createContext((_: Action) => {});
const StateContext = createContext({} as CalcState);

export const CalculatorStoreProvider = ({
  children,
}: CalculatorStoreProvider) => {
   
  const [calc, dispatch] = useReducer(calcReducer, {
    drgMode: "DEG",
    currentOperand: "0",
    expression: [],
    output: "0",
    voltageLevel: 1.0,
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={calc}>
        {children}        
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useDispatch = () => useContext(DispatchContext);
export const useCalcState = () => useContext(StateContext);
