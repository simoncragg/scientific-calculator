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
  switch (input) {
    case "SHIFT": return "shift";
    case "DRG▸": return "angle mode";
    case "+": return "plus";
    case "-": return "minus";
    case "×": return "multiply";
    case "÷": return "divide";
    case ".": return "decimal point";
    case "%": return "percent";
    case "sin": return "sine";
    case "asin": return "arc sine"
    case "=": return "equals";
    default: return input;
  }
};

export const assertOutputIsEqualTo = (expected: string) => {
  const outputEl = screen.getByTestId("output");
  expect(outputEl).toHaveTextContent(expected);
};

export const assertElementIsHidden = (testId: string) => {
  const el = screen.queryByTestId(testId);
  expect(el).not.toBeInTheDocument();
};
