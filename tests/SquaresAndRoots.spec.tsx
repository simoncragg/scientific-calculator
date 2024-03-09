import "@testing-library/jest-dom"
import React from "react";
import { render } from "@testing-library/react"
import App from "../src/components/App"
import { assertOutputIsEqualTo, pressButtons } from "./test-utils";

describe("Squares and Roots", () => {

  beforeEach(() => {
    render(<App />);
  });

  it.each([
    {inputs: ["144", "square root"], expected: "12"},
    {inputs: ["144", "square root", "="], expected: "12"},
    {inputs: ["100", "+", "144", "square root", "="], expected: "112"},
  ])("performs square root calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["5", "SHIFT", "square"], expected: "25"},
    {inputs: ["5", "SHIFT", "square", "="], expected: "25"},
    {inputs: ["123", "+", "30", "SHIFT", "square", "="], expected: "1023"},
  ])("performs square calculations: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["2", "SHIFT", "square", "=", "=", "=", "="], expected: "65536"},
    {inputs: ["123", "+", "30", "SHIFT", "square", "=", "=", "=", "="], expected: "3723"},
    {inputs: ["144", "square root", "=", "=", "=", "="], expected: "1.3642616"},
    {inputs: ["1", "+", "144", "square root", "=", "=", "=", "="], expected: "49"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
