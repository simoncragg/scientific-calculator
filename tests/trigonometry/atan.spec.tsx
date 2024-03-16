import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("arc tan operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["0.25", "SHIFT", "atan"], expected: "14.03624347"},
    {inputs: ["0.25", "SHIFT", "atan", "="], expected: "14.03624347"},
    {inputs: ["0.25", "SHIFT", "atan", "SHIFT", "square"], expected: "197.0161307"},
  ])("can perform an arc tangent operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "0.25", "SHIFT", "atan"], expected: "0.244978663"},
    {inputs: ["DRG▸", "0.25", "SHIFT", "atan", "="], expected: "0.244978663"},
    {inputs: ["DRG▸", "0.25", "SHIFT", "atan", "SHIFT", "square"], expected: "0.060014545"},
  ])("can perform an arc tangent operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "0.25", "SHIFT", "atan"], expected: "15.59582608"},
    {inputs: ["DRG▸", "DRG▸", "0.25", "SHIFT", "atan", "="], expected: "15.59582608"},
    {inputs: ["DRG▸", "DRG▸", "0.25", "SHIFT", "atan", "SHIFT", "square"], expected: "243.229791"},
  ])("can perform an arc tangent operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["0.25", "SHIFT", "atan", "=", "=", "=", "=" ], expected: "14.03624347"},
    {inputs: ["DRG▸", "0.25", "SHIFT", "atan", "=", "=", "=", "=" ], expected: "0.244978663"},
    {inputs: ["DRG▸", "DRG▸", "0.25", "SHIFT", "atan", "=", "=", "=", "=" ], expected: "15.59582608"},
  ])(
    "does not repeat the last arc tangent operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "0.25", "SHIFT", "atan", "=", "=", "=", "="], expected: "57.14497387"},
    {inputs: ["DRG▸", "1", "+", "0.25", "SHIFT", "atan", "=", "=", "=", "="], expected: "1.979914653"},
    {inputs: ["DRG▸", "DRG▸", "1", "+", "0.25", "SHIFT", "atan", "=", "=", "=", "="], expected: "63.3833043"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
