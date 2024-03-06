import "@testing-library/jest-dom"
import { MathJaxContext } from "better-react-mathjax";
import { render, fireEvent, screen } from "@testing-library/react"

import Calculator from "./Calculator"
import { CalculatorStoreProvider } from "../CalculatorStore";

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
  {inputs: ["5", "SHIFT", "square"], expected: "25"},
  {inputs: ["123", "+", "30", "SHIFT", "square", "="], expected: "1023"},
])("performs square calculations: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["144", "square root"], expected: "12"},
  {inputs: ["100", "+", "144", "square root", "="], expected: "112"},
])("performs square root calculations: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
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
])("repeats the last operation when the equals button is pressed consecutively: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["9999999999", "+", "1", "="], expected: "1e10"},
  {inputs: ["9999999999", "+", "2", "="], expected: "1e10"},
  {inputs: ["0.000000001", "÷", "100", "="], expected: "1e-11"},
  {inputs: ["0.000000001", "÷", "1000", "×", "100", "="], expected: "1e-10"}, 
])("displays longer numbers using low precision exponential notation: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

it.each([
  {inputs: ["0.000000001", "÷", "100", "×", "100", "="], expected: "0.000000001"},
  {inputs: ["0.000000001", "÷", "10", "×", "10", "="], expected: "0.000000001"},
])("displays exponential results using fixed-point notation when 10 digits or less: $inputs 🡢 $expected", async ({inputs, expected}) => {
  renderCalculator();
  pressButtons(inputs);
  await assertOutputIsEqualTo(expected);
});

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

const assertElementIsHidden = async (testId: string) => {
  const el = screen.queryByTestId(testId);
  expect(el).not.toBeInTheDocument();
};
