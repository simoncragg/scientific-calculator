import "@testing-library/jest-dom"
import React from "react";

import App from "../src/components/App";
import { assertOutputIsEqualTo, pressButton, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Sexagesimal numbers", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
  });

  it.each([
    { inputs: ["123", "SEX", "8", "SEX", "6", "SEX"], expected: "123.135" },
    { inputs: ["123", "SEX", "8", "SEX", "6", "SEX", "="], expected: "123.135" },
  ])("converts an inputted sexagesimal number to decimal $inputs 🡢 $expected", ({ inputs, expected }) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    { inputs: ["14", "+/-", "SEX", "25", "SEX", "36", "SEX"], expected: "-14.42666667" },
    { inputs: ["14", "SEX", "25", "+/-", "SEX", "36", "SEX"], expected: "14.42666667" },
    { inputs: ["14", "SEX", "25", "SEX", "36", "+/-", "SEX"], expected: "14.42666667" },
    { inputs: ["14", "SEX", "25", "+/-", "SEX", "36", "+/-", "SEX"], expected: "14.42666667" },
  ])("determines the sign of an inputted sexagesimal number from the sign of the degrees component $inputs 🡢 $expected", ({ inputs, expected }) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    { inputs: ["123", "SEX"], expected: "123" },
    { inputs: ["123", "SEX", "8", "SEX", "="], expected: "123.1333333" },
    { inputs: ["14", "SEX", "25", "SEX"], expected: "14.41666667" },
  ])("converts a partially inputted sexagesimal number to decimal", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    { inputs: ["1", "+", "123", "SEX", "8", "SEX", "6", "SEX", "="], expected: "124.135" },
    { inputs: ["1", "+", "123", "SEX", "8", "SEX", "6", "SEX", "-", "1.134", "="], expected: "123.001" },
    { inputs: ["123", "SEX", "8", "SEX", "6", "SEX", "×", "14", "SEX", "25", "SEX", "36", "SEX", "="], expected: "1776.4276" },
  ])("performs arithmetric with sexagesimal numbers", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    { inputs: ["123", "SEX", "8", "SEX", "+", "14", "SEX", "25", "SEX", "="], expected: "137.55" },
    { inputs: ["123", "SEX", "8", "SEX", "×", "14", "SEX", "25", "SEX", "="], expected: "1775.172222" },
  ])("performs arithmetric with partially inputted sexagesimal numbers", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  }); 

  it.each([
    { inputs: ["123.135", "SHIFT", "⇽"], expected: "123°8’6”"},
    { inputs: ["14.42666667", "+/-", "SHIFT", "⇽"], expected: "-14°25’36”"},
  ])("converts a decimal number to sexagesimal", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    { inputs: ["123", "SEX", "8", "SEX", "6", "SEX", "="], expected: "123.135"},
    { inputs: ["14.42666667", "+/-", "SHIFT", "⇽", "="], expected: "-14.42666667"},
  ])("converts sexagesimal back to decimal when equals is pressed", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });
});
