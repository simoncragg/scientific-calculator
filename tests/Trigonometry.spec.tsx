import "@testing-library/jest-dom"
import React from "react";
import { render } from "@testing-library/react"
import App from "../src/components/App"
import { assertOutputIsEqualTo, pressButtons } from "./test-utils";

describe("Trigonometry", () => {

  beforeEach(() => {
    render(<App />);
  });

  it.each([
    {inputs: ["45", "sin"], expected: "0.707106781"},
    {inputs: ["45", "sin", "="], expected: "0.707106781"},
    {inputs: ["45", "sin", "SHIFT", "square"], expected: "0.5"},
  ])("can perform a sin operations in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "45", "sin"], expected: "0.850903525"},
    {inputs: ["DRG▸", "45", "sin", "="], expected: "0.850903525"},
    {inputs: ["DRG▸", "45", "sin", "SHIFT", "square"], expected: "0.724036808"},
  ])("can perform a sin operations in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["DRG▸", "DRG▸", "45", "sin"], expected: "0.649448048"},
    {inputs: ["DRG▸", "DRG▸", "45", "sin", "="], expected: "0.649448048"},
    {inputs: ["DRG▸", "DRG▸", "45", "sin", "SHIFT", "square"], expected: "0.421782767"},
  ])("can perform a sin operations in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOutputIsEqualTo(expected);
  });

  it.each([
    {inputs: ["45", "sin", "=", "=", "=", "=" ], expected: "0.000003759"},
    {inputs: ["1", "+", "45", "sin", "=", "=", "=", "="], expected: "3.828427125"},
    {inputs: ["DRG▸", "45", "sin", "=", "=", "=", "=" ], expected: "0.631131059"},
     {inputs: ["DRG▸", "1", "+", "45", "sin", "=", "=", "=", "="], expected: "4.403614098"},
  ])(
    "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
    ({inputs, expected}) => {

      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    }
  );
});
