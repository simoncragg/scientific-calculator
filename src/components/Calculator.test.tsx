import "@testing-library/jest-dom"
import { MathJaxContext } from "better-react-mathjax";
import { render, fireEvent, screen } from "@testing-library/react"

import Calculator from "./Calculator"
import { CalculatorStoreProvider } from "../CalculatorStore";
import { DRG_MODES } from "../constants";

it("displays zero on start up", async () => {
  renderCalculator();
  expect(screen.getByTestId("output")).toHaveTextContent("0");
});

it("does not display an operator indicator on start up", async () => {
  renderCalculator();
  await assertElementIsHidden("operator-indicator");
});

it("does not display the equals indicator on start up", async () => {
  renderCalculator();
  await assertElementIsHidden("equals");
});

it.each([
  {inputs: ["12345678901"], expected: "1234567890"},
  {inputs: ["0.1234567890"], expected: "0.123456789"},
  {inputs: ["0.1234567890", "+/-"], expected: "-0.123456789"},
  {inputs: ["0.123", "+/-", "4567890"], expected: "-0.123456789"}
])("limits the maximum length of an operand to 10 digits: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["0"], expected: "0"},
  {inputs: ["00"], expected: "0"},
  {inputs: ["01"], expected: "1"},
  {inputs: ["123"], expected: "123"},
])("displays inputed integer operand: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["0.0"], expected: "0.0"},
  {inputs: [".0"], expected: "0.0"},
  {inputs: ["0.00"], expected: "0.00"},
  {inputs: ["0.009"], expected: "0.009"},
  {inputs: ["12.0210"], expected: "12.0210"},
])("displays inputed decimal operand: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["1", "+", "1", "="], expected: "2"},
  {inputs: ["0.1", "+", "0.1", "="], expected: "0.2"},
  {inputs: [".01", "+", "0.01", "="], expected: "0.02"},
  {inputs: ["32768.1638", "+", "16384.0819", "="], expected: "49152.2457"},
  {inputs: ["99", "+", "1", "="], expected: "100"},
  {inputs: ["1", "-", "1", "="], expected: "0"},
  {inputs: [".01", "-", ".001", "="], expected: "0.009"},
  {inputs: ["100", "-", "99", "="], expected: "1"},
  {inputs: ["1", "×", "0", "="], expected: "0"},
  {inputs: ["10", "×", "0.1", "="], expected: "1"},
  {inputs: ["10.1", "×", "0.1", "="], expected: "1.01"},
  {inputs: ["10", "×", "10", "="], expected: "100"},
  {inputs: ["1", "÷", "0", "="], expected: "Error"},
  {inputs: ["1", "÷", "1", "="], expected: "1"},
  {inputs: ["10", "÷", "5", "="], expected: "2"},
  {inputs: ["100", "÷", "0.5", "="], expected: "200"},
])("performs arithmetic: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["1", "+", "="], expected: "2"},
  {inputs: ["2", "-", "="], expected: "0"},
  {inputs: ["3", "×", "="], expected: "9"},
  {inputs: ["4", "÷", "="], expected: "1"},
])("infers missing operand: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["5", "+", "5", "+"], expected: "10"},
  {inputs: ["5", "+", "5", "-"], expected: "10"},
  {inputs: ["5", "×", "5", "×"], expected: "25"},
  {inputs: ["5", "÷", "5", "÷"], expected: "1"},
  {inputs: ["5", "×", "5", "÷"], expected: "25"},
  {inputs: ["5", "÷", "5", "×"], expected: "1"},
  {inputs: ["5", "×", "5", "+"], expected: "25"},
  {inputs: ["5", "×", "5", "-"], expected: "25"},
  {inputs: ["5", "÷", "5", "+"], expected: "1"},
  {inputs: ["5", "÷", "5", "-"], expected: "1"},
  {inputs: ["5", "+", "5", "×"], expected: "5"},
  {inputs: ["5", "+", "5", "÷"], expected: "5"},
  {inputs: ["5", "-", "5", "×"], expected: "5"},
  {inputs: ["5", "-", "5", "÷"], expected: "5"},
  {inputs: ["5", "+", "5", "×", "5", "×"], expected: "25"},
  {inputs: ["5", "-", "5", "×", "5", "×"], expected: "25"},
  {inputs: ["5", "+", "5", "÷", "5", "×"], expected: "1"},
  {inputs: ["5", "-", "5", "÷", "5", "×"], expected: "1"},
  {inputs: ["300", "×", "2", "×"], expected: "600"},
  {inputs: ["300", "×", "100", "÷"], expected: "30000"},
  {inputs: ["300", "÷", "2", "÷"], expected: "150"},
  {inputs: ["300", "÷", "100", "×"], expected: "3"},
])("displays interim MDAS evaluation steps: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["10", "+/-"], expected: "-10"},
  {inputs: ["0.1", "×", "10", "+/-", "="], expected: "-1"},
  {inputs: ["10", "+/-", "+/-"], expected: "10"},
  {inputs: ["10", "+/-", "+", "10", "="], expected: "0"},
  {inputs: ["10", "+/-", "+", "10", "+/-", "="], expected: "-20"},
  {inputs: ["10", "+/-", "+/-", "+", "10", "+/-", "="], expected: "0"},
  {inputs: ["10", "+/-", "+", "10", "+/-", "=", "+/-"], expected: "20"},
  {
    inputs: ["10", "+/-", "+", "10", "+/-", "=", "+/-", "-", "10", "=", "+/-", "÷", "2", "=", "+/-", "×", "3", "+/-", "="],
    expected: "-15"
  },
  {inputs: ["1", "÷", "0", "=", "+/-"], expected: "Error"},
])("inverts a number when the invert function button is pressed: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["5", "0", "0", "SHIFT", "%"], expected: "5"},
  {inputs: ["5", "0", "SHIFT", "%"], expected: "0.5"},
  {inputs: ["5", "SHIFT", "%"], expected: "0.05"},
  {inputs: ["0", ".", "5", "SHIFT", "%"], expected: "0.005"}
])("performs percentage calculations involving a single operand: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["1500", "×", "12", "SHIFT", "%"], expected: "180"},
  {inputs: ["660", "÷", "880", "SHIFT", "%"], expected: "75"},
  {inputs: ["2500", "+", "15", "SHIFT", "%"], expected: "2875"},
  {inputs: ["3500", "-", "25", "SHIFT", "%"], expected: "2625"},
])("performs percentage calculations involving two operands: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["144", "square root"], expected: "12"},
  {inputs: ["144", "square root", "="], expected: "12"},
  {inputs: ["100", "+", "144", "square root", "="], expected: "112"},
])("performs square root calculations: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["5", "SHIFT", "square"], expected: "25"},
  {inputs: ["5", "SHIFT", "square", "="], expected: "25"},
  {inputs: ["123", "+", "30", "SHIFT", "square", "="], expected: "1023"},
])("performs square calculations: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["1.23", "log"], expected: "0.089905111"},
  {inputs: ["1.23", "log", "="], expected: "0.089905111"},
  {inputs: ["100", "+", "1.23", "log", "="], expected: "100.0899051"},
])("performs log calculations: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["0.4", "SHIFT", "power of ten"], expected: "2.511886432"},
  {inputs: ["0.4", "SHIFT", "power of ten", "="], expected: "2.511886432"},
  {inputs: ["100", "+", "10", "SHIFT", "power of ten", "="], expected: "101"},
])("performs power of ten calculations: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["10", "natural log"], expected: "2.302585093"},
  {inputs: ["10", "natural log", "="], expected: "2.302585093"},
  {inputs: ["100", "+", "10", "natural log", "="], expected: "102.3025851"},
])("performs natural log calculations: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["10", "SHIFT", "exp x"], expected: "22026.46579"},
  {inputs: ["10", "SHIFT", "exp x", "="], expected: "22026.46579"},
  {inputs: ["100", "+", "10", "SHIFT", "exp x", "="], expected: "22126.46579"},
])("performs exp(x) calculations: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it("can cycle through all three DRG modes", async () => {
  renderCalculator();
  const drgModeEl = screen.getByLabelText("drg mode indicator");
  const modeCount = DRG_MODES.length;
  for (let i = 0; i < modeCount; i++) {
    const expectedCurrentMode = DRG_MODES[i % modeCount];
    const expectedNewMode = DRG_MODES[(i + 1) % modeCount];
    expect(drgModeEl).toHaveTextContent(expectedCurrentMode);
    pressButton("drg mode");
    expect(drgModeEl).toHaveTextContent(expectedNewMode);
  }
});

it.each([
  {inputs: ["AC"], expected: "0"},
  {inputs: ["5", "C"], expected: "0"},
  {inputs: ["5", "+", "5", "C", "6"], expected: "6"},
  {inputs: ["5", "+", "5", "C", "6", "="], expected: "11"},
  {inputs: ["5", "+", "5", "C", "AC"], expected: "0"},
])("clears memory: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
  await assertElementIsHidden("operator-indicator");
  if (inputs[inputs.length - 1] !== "=") {
    await assertElementIsHidden("equals-indicator");
  }
});

it.each([
  {inputs: ["5", "+", "C"]},
  {inputs: ["5", "÷", "5", "C", "AC"]}
])("clears operator indicators: $inputs 🡢 $expected", async ({inputs}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertElementIsHidden("operator-indicator");
});

it.each([
  {inputs: ["1", "+", "1", "=", "C"]},
  {inputs: ["5", "÷", "5", "=", "C", "AC"]}
])("clears equals indicators: $inputs 🡢 $expected", async ({inputs}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertElementIsHidden("equals-indicator");
});

it.each([
  {inputs: ["4","+", "4", "=", "=", "=", "="], expected: "20"},
  {inputs: ["20","-", "4", "=", "=", "=", "="], expected: "4"},
  {inputs: ["4", "×", "2", "=", "=", "=", "="], expected: "64"},
  {inputs: ["64", "÷", "2", "=", "=", "=", "="], expected: "4"},
  {inputs: ["5", "+", "5", "=", "=", "=", "÷", "4", "="], expected: "5"},
  {inputs: ["5", "+", "=", "=", "=", "="], expected: "25"},
  {inputs: ["2", "SHIFT", "square", "=", "=", "=", "="], expected: "65536"},
  {inputs: ["1500", "×", "12", "SHIFT", "%", "=", "=", "=", "="], expected: "0.31104"},
  {inputs: ["123", "+", "30", "SHIFT", "square", "=", "=", "=", "="], expected: "3723"},
  {inputs: ["144", "square root", "=", "=", "=", "="], expected: "1.3642616"},
  {inputs: ["1", "+", "144", "square root", "=", "=", "=", "="], expected: "49"},
  {inputs: ["1.23", "log", "=", "="], expected: "-1.046215616"},
  {inputs: ["1", "+", "1.23", "log", "=", "=", "=", "="], expected: "1.359620446"},
  {inputs: ["0.000000001", "SHIFT", "power of ten", "=", "="], expected: "10.00000005"},
  {inputs: ["1", "+", "0.4", "SHIFT", "power of ten", "=", "=", "=", "="], expected: "11.04754573"},
  {inputs: ["100", "natural log", "=", "=", "=", "="], expected: "-0.85938442"},
  {inputs: ["1", "+", "10", "natural log", "=", "=", "=", "="], expected: "10.2103403"},
  {inputs: ["1", "SHIFT", "exp x", "=", "=", "=" ], expected: "3814279.105"},
  {inputs: ["1", "+", "10", "SHIFT", "exp x", "=", "=", "=", "="], expected: "88106.86318"},
])(
  "repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", 
  async ({inputs, expected}) => {
    renderCalculator();
    pressButtons(inputs);
    await assertOutputIsEqualTo(expected);
  }
);

it.each([
  {
    inputs: ["9999999999", "×", "9999999999", "="], 
    expectedCoefficient: 9.999999998, 
    expectedBase: 10,
    expectedExponent: 19,
  },
  {
    inputs: ["9999999999", "SHIFT", "square", "=", "=", "=", "="], 
    expectedCoefficient: 9.999999984,
    expectedBase: 10,
    expectedExponent: 159,
  },
  {
    inputs: ["9999999999", "×", "9999999999", "="], 
    expectedCoefficient: 9.999999998,
    expectedBase: 10,
    expectedExponent: 19,
  },
  {
    inputs: ["6.25", "÷", "9999999999", "="],
    expectedCoefficient: 6.250000001,
    expectedBase: 10,
    expectedExponent: -10,
  },
  {
    inputs: ["0.5", "÷", "1111111111", "="],
    expectedCoefficient: 4.5,
    expectedBase: 10,
    expectedExponent: -10,
  }
])(
  "displays exponential correctly: $inputs 🡢 $expected", 
  async ({inputs, expectedCoefficient, expectedBase, expectedExponent }) => {
    renderCalculator();
    pressButtons(inputs);
    await assertCoefficientIsDisplayed(expectedCoefficient);
    await assertTimesBaseIsDisplayed(expectedBase);
    await assertExponentIsDisplayed(expectedExponent);
  }
);

it.each([
  {inputs: ["0.000000001", "÷", "100", "×", "100", "="], expected: "0.000000001"},
  {inputs: ["0.000000001", "÷", "10", "×", "10", "="], expected: "0.000000001"},
])(
  "displays an exponential number result in fixed-point notation when exponent is 10 or less: $inputs 🡢 $expected", 
  async ({inputs, expected}) => {
    renderCalculator();
    pressButtons(inputs);
    await assertOutputIsEqualTo(expected);
  }
);

it.each([
  {inputs: ["÷", "×", "+", "-", "+", "5", "="], expected: "5"},
  {inputs: ["÷", "×", "+", "-", "+", "-", "5", "="], expected: "-5"},
  {inputs: ["2", "÷", "×", "+", "-", "+", "×", "÷", "1", "="], expected: "2"},
  {inputs: ["1", "÷", "×", "+", "-", "+", "×", "2"], expected: "2"}
])("handles consecutive operation selections: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["SHIFT"]},
  {inputs: ["5", "+", "10", "SHIFT"]},
])("displays the shift indicator when shift key is pressed", async ({inputs}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertShiftIndicatorIsDisplayed();
});

it.each([
  {inputs: ["5", "+", "10", "SHIFT", "%"]},
])("hides the shift indicator when a function is selected", async ({inputs}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertShiftIndicatorIsNotDisplayed();
});

it.each([
  {inputs: ["+"], expected: "plus indicator"},
  {inputs: ["-"], expected: "minus indicator"},
  {inputs: ["×"], expected: "multiply indicator"},
  {inputs: ["÷"], expected: "divide indicator"},
])("displays the correct operator indicator when an operator is pressed", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOperatorIndicatorIsDisplayed(expected);
});

it.each([
  {inputs: ["+", "3"]},
  {inputs: ["-", "3"]},
  {inputs: ["×", "3"]},
  {inputs: ["÷", "3"]},
])("hides operator indicator when an operand is pressed", async ({inputs}) => {
  renderCalculator();
  pressButtons(inputs);
  const indicatorEl = screen.queryByTestId("operator-indicator");
  expect(indicatorEl).not.toBeInTheDocument();
});

it("displays the equals indicator when the equals button is pressed", async () => {
  renderCalculator();
  pressButtons(["1", "+", "1", "="]);
  const indicatorEl = screen.queryByLabelText("equals indicator");
  expect(indicatorEl).toBeInTheDocument();
});

it("hides the equals indicator when an operand pressed", async () => {
  renderCalculator();
  pressButtons(["=", "3"]);
  await assertElementIsHidden("equals-operator");
});

const renderCalculator = () => {

  const config = {
    loader: { 
      load: ["input/asciimath"]
    },
    displaystyle: false,
  };

  render(
    <MathJaxContext config={config}>
      <CalculatorStoreProvider>
        <Calculator />
      </CalculatorStoreProvider>
    </MathJaxContext>
  );
}

const pressButtons = (inputs: string[]) => {
  const rawInput = inputs.flatMap(input => 
    isNaN(Number(input))
      ? input
      : input.split("")
  );

  for (const input of rawInput) {
    pressButton(input);
  }
};

const pressButton = (key: string) => {
  const name = getMappedName(key);
  fireEvent.click(screen.getByRole("button", { name }));
};

const getMappedName = (key: string) => {
  if (key === "SHIFT") return "shift";
  if (key === "+") return "plus";
  if (key === "-") return "minus";
  if (key === "×") return "multiply";
  if (key === "÷") return "divide";
  if (key === ".") return "decimal point";
  if (key === "%") return "percent";
  if (key === "=") return "equals";
  return key;
}

const assertOutputIsEqualTo = async (expected: string) => {
  const outputEl = screen.getByTestId("output");
  expect(outputEl).toHaveTextContent(expected);
};

const assertShiftIndicatorIsDisplayed = async () => {
  const indicatorEl = screen.getByLabelText('shift indicator');
  expect(indicatorEl).toBeInTheDocument();
};

const assertShiftIndicatorIsNotDisplayed = async () => {
  const indicatorEl = screen.queryByLabelText('shift indicator');
  expect(indicatorEl).not.toBeInTheDocument();
};

const assertOperatorIndicatorIsDisplayed = async (expectedAriaLabel: string) => {
  const indicatorEl = screen.getByTestId('operator-indicator');
  expect(indicatorEl).toHaveAccessibleName(expectedAriaLabel);
};

const assertCoefficientIsDisplayed = async (expectedCoefficient: number) => {
  const coefficientEl = screen.getByLabelText("coefficient");
  expect(coefficientEl).toBeInTheDocument();
  expect(coefficientEl.innerHTML).toEqual(`${expectedCoefficient}`);
};

const assertTimesBaseIsDisplayed = async (expectedBase: number) => {
  const timeBaseEl = screen.getByLabelText("times base");
  expect(timeBaseEl).toBeInTheDocument();
  expect(timeBaseEl.innerHTML).toEqual(`x${expectedBase}`);
};

const assertExponentIsDisplayed = async (expectedExponent: number) => {
  const assertExponentEl = screen.getByLabelText("exponent");
  expect(assertExponentEl).toBeInTheDocument();
  expect(assertExponentEl.innerHTML).toEqual(`${expectedExponent}`);
};

const assertElementIsHidden = async (testId: string) => {
  const el = screen.queryByTestId(testId);
  expect(el).not.toBeInTheDocument();
};
