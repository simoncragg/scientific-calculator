import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/components/App";
import { ANGLE_MODES } from "../src/constants";

import { 
  assertElementIsHidden, 
  pressButton, 
  pressButtons
} from "./test-utils";

describe("Display indicators", () => {

  beforeEach(() => {
    render(<App />);
  });

  it("can cycle through all three DRG▸s", () => {
    const drgModeEl = screen.getByLabelText("angle mode indicator");
    const modeCount = ANGLE_MODES.length;
    for (let i = 0; i < modeCount; i++) {
      const expectedCurrentMode = ANGLE_MODES[i % modeCount];
      const expectedNewMode = ANGLE_MODES[(i + 1) % modeCount];
      expect(drgModeEl).toHaveTextContent(expectedCurrentMode);
      pressButton("DRG▸");
      expect(drgModeEl).toHaveTextContent(expectedNewMode);
    }
  });

  it.each([
    {inputs: ["SHIFT"]},
    {inputs: ["5", "+", "10", "SHIFT"]},
  ])("displays the shift indicator when shift key is pressed", ({inputs}) => {
    pressButtons(inputs);
    assertShiftIndicatorIsDisplayed();
  });

  it.each([
    {inputs: ["5", "+", "10", "SHIFT", "%"]},
  ])("hides the shift indicator when a function is selected", ({inputs}) => {
    pressButtons(inputs);
    assertShiftIndicatorIsNotDisplayed();
  });

  it.each([
    {inputs: ["+"], expected: "plus indicator"},
    {inputs: ["-"], expected: "minus indicator"},
    {inputs: ["×"], expected: "multiply indicator"},
    {inputs: ["÷"], expected: "divide indicator"},
  ])("displays the correct operator indicator when an operator is pressed", ({inputs, expected}) => {
    pressButtons(inputs);
    assertOperatorIndicatorIsDisplayed(expected);
  });

  it.each([
    {inputs: ["+", "3"]},
    {inputs: ["-", "3"]},
    {inputs: ["×", "3"]},
    {inputs: ["÷", "3"]},
  ])("hides operator indicator when an operand is pressed", ({inputs}) => {
    pressButtons(inputs);
    const indicatorEl = screen.queryByTestId("operator-indicator");
    expect(indicatorEl).not.toBeInTheDocument();
  });

  it("displays the equals indicator when the equals button is pressed", () => {
    pressButtons(["1", "+", "1", "="]);
    const indicatorEl = screen.queryByLabelText("equals indicator");
    expect(indicatorEl).toBeInTheDocument();
  });

  it("hides the equals indicator when an operand pressed", () => {
    pressButtons(["=", "3"]);
    assertElementIsHidden("equals-operator");
  });

  const assertShiftIndicatorIsDisplayed = () => {
    const indicatorEl = screen.getByLabelText('shift indicator');
    expect(indicatorEl).toBeInTheDocument();
  };
  
  const assertShiftIndicatorIsNotDisplayed = () => {
    const indicatorEl = screen.queryByLabelText('shift indicator');
    expect(indicatorEl).not.toBeInTheDocument();
  };
  
  const assertOperatorIndicatorIsDisplayed = (expectedAriaLabel: string) => {
    const indicatorEl = screen.getByTestId('operator-indicator');
    expect(indicatorEl).toHaveAccessibleName(expectedAriaLabel);
  };
});
