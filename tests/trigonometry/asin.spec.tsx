import "@testing-library/jest-dom"
import React from "react";

import App from "../../src/components/App";

import { 
  assertOutputIsEqualTo, 
  pressButtons, 
  renderWithProviders
} from "../test-utils";

import { initialState } from "../../src/calcSlice";

describe("arc sine operations", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
    });
  });

  it.each([
    {inputs: ["0.5", "SHIFT", "asin"], expected: "30"},
    {inputs: ["0.5", "SHIFT", "asin", "="], expected: "30"},
    {inputs: ["0.5", "SHIFT", "asin", "SHIFT", "square"], expected: "900"},
  ])("can perform an arc sine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "0.5", "SHIFT", "asin"], expected: "0.523598776"},
    {inputs: ["DRG▸", "0.5", "SHIFT", "asin", "="], expected: "0.523598776"},
    {inputs: ["DRG▸", "0.5", "SHIFT", "asin", "SHIFT", "square"], expected: "0.274155678"},
  ])("can perform an arc sine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "0.5", "SHIFT", "asin"], expected: "33.33333333"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "SHIFT", "asin", "="], expected: "33.33333333"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "SHIFT", "asin", "SHIFT", "square"], expected: "1111.111111"},
  ])("can perform an arc sine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["0.5", "SHIFT", "asin", "=", "=", "=", "=" ], expected: "30"},
    {inputs: ["DRG▸", "0.5", "SHIFT", "asin", "=", "=", "=", "=" ], expected: "0.523598776"},
    {inputs: ["DRG▸", "DRG▸", "0.5", "SHIFT", "asin", "=", "=", "=", "=" ], expected: "33.33333333"},
  ])(
    "does not repeat the last arc sine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );

  it.each([
    {inputs: ["1", "+", "0.5", "SHIFT", "asin", "=", "=", "=", "="], expected: "121"},
    {inputs: ["DRG▸", "1", "+", "0.5", "SHIFT", "asin", "=", "=", "=", "="], expected: "3.094395102"},
    {inputs: ["DRG▸", "DRG▸", "1", "+", "0.5", "SHIFT", "asin", "=", "=", "=", "="], expected: "134.3333333"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
