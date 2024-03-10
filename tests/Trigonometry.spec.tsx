import "@testing-library/jest-dom"
import React from "react";
import { render } from "@testing-library/react"

import App from "../src/components/App"
import { assertOutputIsEqualTo, pressButtons } from "./test-utils";

describe("Trigonometry", () => {

  beforeEach(() => {
    render(<App />);
  });

  describe("sine operations", () => {

    it.each([
      {inputs: ["45", "sin"], expected: "0.707106781"},
      {inputs: ["45", "sin", "="], expected: "0.707106781"},
      {inputs: ["45", "sin", "SHIFT", "square"], expected: "0.5"},
    ])("can perform a sine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    });

    it.each([
      {inputs: ["DRG▸", "45", "sin"], expected: "0.850903525"},
      {inputs: ["DRG▸", "45", "sin", "="], expected: "0.850903525"},
      {inputs: ["DRG▸", "45", "sin", "SHIFT", "square"], expected: "0.724036808"},
    ])("can perform a sine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    });

    it.each([
      {inputs: ["DRG▸", "DRG▸", "45", "sin"], expected: "0.649448048"},
      {inputs: ["DRG▸", "DRG▸", "45", "sin", "="], expected: "0.649448048"},
      {inputs: ["DRG▸", "DRG▸", "45", "sin", "SHIFT", "square"], expected: "0.421782767"},
    ])("can perform a sine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    });

    it.each([
      {inputs: ["45", "sin", "=", "=", "=", "=" ], expected: "0.707106781"},
      {inputs: ["DRG▸", "45", "sin", "=", "=", "=", "=" ], expected: "0.850903525"},
      {inputs: ["DRG▸", "DRG▸", "45", "sin", "=", "=", "=", "=" ], expected: "0.649448048"},
    ])(
      "does not repeat the last sin function operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
      ({inputs, expected}) => {
  
        pressButtons(inputs);
        assertOutputIsEqualTo(expected);
      }
    );

    it.each([
      {inputs: ["1", "+", "45", "sin", "=", "=", "=", "="], expected: "3.828427125"},
      {inputs: ["DRG▸", "1", "+", "45", "sin", "=", "=", "=", "="], expected: "4.403614098"},
      {inputs: ["DRG▸", "DRG▸", "1", "+", "45", "sin", "=", "=", "=", "="], expected: "3.597792193"},
    ])(
      "repeats the last operation for an arithmetic operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
      ({inputs, expected}) => {
  
        pressButtons(inputs);
        assertOutputIsEqualTo(expected);
      }
    );
  });

  describe("arc sine operations", () => {
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
      "does not repeat the last arc sine function operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
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
});
