import { fireEvent, screen } from "@testing-library/react";

export const pressButtons = (inputs: string[]) => {
  const rawInput = inputs.flatMap(input => 
      isNaN(Number(input))
      ? input
      : input.split("")
  );

  for (const input of rawInput) {
      pressButton(input);
  }
};

export const pressButton = (input: string) => {
  const ariaLabel = mapToAriaLabel(input);
  fireEvent.click(screen.getByRole("button", { name: ariaLabel }));
};

export const mapToAriaLabel = (input: string): string => {
  if (input === "SHIFT") return "shift";
  if (input === "DRG▸") return "angle mode";
  if (input === "+") return "plus";
  if (input === "-") return "minus";
  if (input === "×") return "multiply";
  if (input === "÷") return "divide";
  if (input === ".") return "decimal point";
  if (input === "%") return "percent";
  if (input === "sin") return "sine";
  if (input === "=") return "equals";
  return input;
};

export const assertOutputIsEqualTo = (expected: string) => {
  const outputEl = screen.getByTestId("output");
  expect(outputEl).toHaveTextContent(expected);
};

export const assertElementIsHidden = (testId: string) => {
  const el = screen.queryByTestId(testId);
  expect(el).not.toBeInTheDocument();
};
