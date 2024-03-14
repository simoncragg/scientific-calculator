import "@testing-library/jest-dom"
import React from "react";

import App from "../src/components/App"
import { assertOutputIsEqualTo, pressButtons } from "./test-utils";
import { initialState } from "../src/calcSlice";
import { renderWithProviders } from "./test-utils";

describe("Trigonometry", () => {

  beforeEach(() => {
    renderWithProviders(
      <App />, {
        preloadedState: {
          calc: initialState,
       }
      });
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
      "does not repeat the last sine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
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

  describe("cosine operations", () => {

    it.each([
      {inputs: ["22.5", "cos"], expected: "0.923879533"},
      {inputs: ["22.5", "cos", "="], expected: "0.923879533"},
      {inputs: ["22.5", "cos", "SHIFT", "square"], expected: "0.853553391"},
    ])("can perform a cosine operation in DEG mode: $inputs 🡢 $expected", ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    });

    it.each([
      {inputs: ["DRG▸", "22.5", "cos"], expected: "-0.87330464"},
      {inputs: ["DRG▸", "22.5", "cos", "="], expected: "-0.87330464"},
      {inputs: ["DRG▸", "22.5", "cos", "SHIFT", "square"], expected: "0.762660994"},
    ])("can perform a cosine operation in RAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    });

    it.each([
      {inputs: ["DRG▸", "DRG▸", "22.5", "cos"], expected: "0.938191336"},
      {inputs: ["DRG▸", "DRG▸", "22.5", "cos", "="], expected: "0.938191336"},
      {inputs: ["DRG▸", "DRG▸", "22.5", "cos", "SHIFT", "square"], expected: "0.880202983"},
    ])("can perform a cosine operation in GRAD mode: $inputs 🡢 $expected", ({inputs, expected}) => {
      pressButtons(inputs);
      assertOutputIsEqualTo(expected);
    });

    it.each([
      {inputs: ["22.5", "cos", "=", "=", "=", "=" ], expected: "0.923879533"},
      {inputs: ["DRG▸", "22.5", "cos", "=", "=", "=", "=" ], expected: "-0.87330464"},
      {inputs: ["DRG▸", "DRG▸", "22.5", "cos", "=", "=", "=", "=" ], expected: "0.938191336"},
    ])(
      "does not repeat the last cosine operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
      ({inputs, expected}) => {
  
        pressButtons(inputs);
        assertOutputIsEqualTo(expected);
      }
    );

    it.each([
      {inputs: ["1", "+", "22.5", "cos", "=", "=", "=", "="], expected: "4.69551813"},
      {inputs: ["DRG▸", "1", "+", "22.5", "cos", "=", "=", "=", "="], expected: "-2.49321856"},
      {inputs: ["DRG▸", "DRG▸", "1", "+", "22.5", "cos", "=", "=", "=", "="], expected: "4.752765344"},
    ])(
      "repeats the last operation for an arithmetic operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
      ({inputs, expected}) => {
  
        pressButtons(inputs);
        assertOutputIsEqualTo(expected);
      }
    );
  });

  describe("tangent operations", () => {

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

  describe("arc cosine operations", () => {
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

  describe("arc tangent operations", () => {
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
});
