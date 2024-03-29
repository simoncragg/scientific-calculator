import "@testing-library/jest-dom";
import React from "react";

import App from "../src/components/App";
import { assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Cube and Cube Root", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    {inputs: ["8", "SHIFT", "cube root"], expected: "2"},
    {inputs: ["64", "SHIFT", "cube root"], expected: "4"},
    {inputs: ["216", "SHIFT", "cube root"], expected: "6"},
    {inputs: ["1000", "SHIFT", "cube root"], expected: "10"},
    {inputs: ["1000000", "SHIFT", "cube root"], expected: "100"},
    {inputs: ["1000000000", "SHIFT", "cube root"], expected: "1000"},
    {inputs: ["100", "+", "216", "SHIFT", "cube root", "="], expected: "106"},
  ])("performs cube root calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["1000000000", "SHIFT", "cube root", "=", "=", "="], expected: "2.15443469"},
    {inputs: ["1", "+", "1000000000", "SHIFT", "cube root", "=", "=", "="], expected: "3001"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
