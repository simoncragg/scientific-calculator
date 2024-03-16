import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("arc cosine operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["0.5", "SHIFT", "acos"], expected: "60"},
    {inputs: ["0.5", "SHIFT", "acos", "="], expected: "60"},
    {inputs: ["0.5", "SHIFT", "acos", "SHIFT", "square"], expected: "3600"},
  ])("can perform an arc cosine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "0.5", "SHIFT", "acos"], expected: "1.047197551"},
    {inputs: ["DRG▸", "0.5", "SHIFT", "acos", "="], expected: "1.047197551"},
    {inputs: ["DRG▸", "0.5", "SHIFT", "acos", "SHIFT", "square"], expected: "1.096622711"},
  ])("can perform an arc cosine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "0.5", "SHIFT", "acos"], expected: "66.66666667"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "SHIFT", "acos", "="], expected: "66.66666667"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "SHIFT", "acos", "SHIFT", "square"], expected: "4444.444444"},
  ])("can perform an arc cosine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["0.5", "SHIFT", "acos", "=", "=", "=", "=" ], expected: "60"},
    {inputs: ["DRG▸", "0.5", "SHIFT", "acos", "=", "=", "=", "=" ], expected: "1.047197551"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "SHIFT", "acos", "=", "=", "=", "=" ], expected: "66.66666667"},
  ])(
    "does not repeat the last arc cosine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "0.5", "SHIFT", "acos", "=", "=", "=", "="], expected: "241"},
    {inputs: ["DRG▸", "1", "+", "0.5", "SHIFT", "acos", "=", "=", "=", "="], expected: "5.188790205"},
    {inputs: ["DRG▸", "DRG▸", "1", "+", "0.5", "SHIFT", "acos", "=", "=", "=", "="], expected: "267.6666667"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
