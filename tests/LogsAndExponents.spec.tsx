import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Logs and Exponents", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    {inputs: ["1.23", "log"], expected: "0.089905111"},
    {inputs: ["1.23", "log", "="], expected: "0.089905111"},
    {inputs: ["100", "+", "1.23", "log", "="], expected: "100.0899051"},
  ])("performs log calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["0.4", "SHIFT", "power of ten"], expected: "2.511886432"},
    {inputs: ["0.4", "SHIFT", "power of ten", "="], expected: "2.511886432"},
    {inputs: ["100", "+", "10", "SHIFT", "power of ten", "="], expected: "101"},
  ])("performs power of ten calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["10", "natural log"], expected: "2.302585093"},
    {inputs: ["10", "natural log", "="], expected: "2.302585093"},
    {inputs: ["100", "+", "10", "natural log", "="], expected: "102.3025851"},
  ])("performs natural log calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["10", "SHIFT", "exp x"], expected: "22026.46579"},
    {inputs: ["10", "SHIFT", "exp x", "="], expected: "22026.46579"},
    {inputs: ["100", "+", "10", "SHIFT", "exp x", "="], expected: "22126.46579"},
  ])("performs exp(x) calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1.23", "log", "=", "="], expected: "-1.046215616"},
    {inputs: ["1", "+", "1.23", "log", "=", "=", "=", "="], expected: "1.359620446"},
    {inputs: ["0.000000001", "SHIFT", "power of ten", "=", "="], expected: "10.00000005"},
    {inputs: ["1", "+", "0.4", "SHIFT", "power of ten", "=", "=", "=", "="], expected: "11.04754573"},
    {inputs: ["100", "natural log", "=", "=", "=", "="], expected: "-0.85938442"},
    {inputs: ["1", "+", "10", "natural log", "=", "=", "=", "="], expected: "10.2103403"},
    {inputs: ["1", "SHIFT", "exp x", "=", "=", "="], expected: "3814279.105"},
    {inputs: ["1", "+", "10", "SHIFT", "exp x", "=", "=", "=", "="], expected: "88106.86318"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
