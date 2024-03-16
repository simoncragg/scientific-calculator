import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("area hyperbolic sine operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["0.5", "HYP", "SHIFT", "asinh"], expected: "27.57140663"},
    {inputs: ["0.5", "HYP", "SHIFT", "asinh", "="], expected: "27.57140663"},
    {inputs: ["0.5", "HYP", "SHIFT", "asinh", "SHIFT", "square"], expected: "760.1824634"},
  ])("can perform an area hyperbolic sine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "0.5", "HYP", "SHIFT", "asinh"], expected: "0.481211825"},
    {inputs: ["DRG▸", "0.5", "HYP", "SHIFT", "asinh", "="], expected: "0.481211825"},
    {inputs: ["DRG▸", "0.5", "HYP", "SHIFT", "asinh", "SHIFT", "square"], expected: "0.231564821"},
  ])("can perform an area hyperbolic sine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "0.5", "HYP", "SHIFT", "asinh"], expected: "30.63489625"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "HYP", "SHIFT", "asinh", "="], expected: "30.63489625"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "HYP", "SHIFT", "asinh", "SHIFT", "square"], expected: "938.4968684"},
  ])("can perform an area hyperbolic sine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["0.5", "HYP", "SHIFT", "asinh", "=", "=", "=", "=" ], expected: "27.57140663"},
    {inputs: ["DRG▸", "0.5", "HYP", "SHIFT", "asinh", "=", "=", "=", "=" ], expected: "0.481211825"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "HYP", "SHIFT", "asinh", "=", "=", "=", "=" ], expected: "30.63489625"},
  ])(
    "does not repeat the last area hyperbolic sine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "0.5", "HYP", "SHIFT", "asinh", "=", "=", "=", "="], expected: "111.2856265"},
    {inputs: ["DRG▸", "1", "+", "0.5", "HYP", "SHIFT", "asinh", "=", "=", "=", "="], expected: "2.9248473"},
    {inputs: ["DRG▸", "DRG▸", "1", "+", "0.5", "HYP", "SHIFT", "asinh", "=", "=", "=", "="], expected: "123.539585"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
