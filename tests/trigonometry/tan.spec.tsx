import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("Tangent operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["67.5", "tan"], expected: "2.414213562"},
    {inputs: ["67.5", "tan", "="], expected: "2.414213562"},
    {inputs: ["67.5", "tan", "SHIFT", "square"], expected: "5.828427125"},
  ])("can perform a tangent operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "67.5", "tan"], expected: "22.58818053"},
    {inputs: ["DRG▸", "67.5", "tan", "="], expected: "22.58818053"},
    {inputs: ["DRG▸", "67.5", "tan", "SHIFT", "square"], expected: "510.2258998"},
  ])("can perform a tangent operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "67.5", "tan"], expected: "1.785628485"},
    {inputs: ["DRG▸", "DRG▸", "67.5", "tan", "="], expected: "1.785628485"},
    {inputs: ["DRG▸", "DRG▸", "67.5", "tan", "SHIFT", "square"], expected: "3.188469086"},
  ])("can perform a tangent operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["67.5", "tan", "=", "=", "=", "=" ], expected: "2.414213562"},
    {inputs: ["DRG▸", "67.5", "tan", "=", "=", "=", "=" ], expected: "22.58818053"},
    {inputs: ["DRG▸", "DRG▸", "67.5", "tan", "=", "=", "=", "=" ], expected: "1.785628485"},
  ])(
    "does not repeat the last tangent operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "67.5", "tan", "=", "=", "=", "="], expected: "10.65685425"},
    {inputs: ["DRG▸", "1", "+", "67.5", "tan", "=", "=", "=", "="], expected: "91.35272213"},
    {inputs: ["DRG▸", "DRG▸", "1", "+", "67.5", "tan", "=", "=", "=", "="], expected: "8.142513939"},
  ])(
    "repeats the last operation for an arithmetic operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
