import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/components/App";
import { assertElementIsHidden } from "./test-utils";

describe("Initial conditions", () => {

  beforeEach(() => {
    render(<App />);
  });

  it("displays zero on start up", () => {
    expect(screen.getByTestId("output")).toHaveTextContent("0");
  });

  it("displays DEG mode on start up", () => {
    const el = screen.getByLabelText("drg mode indicator");
    expect(el).toBeInTheDocument();
  });

  it("does not display an operator indicator on start up", () => {
    assertElementIsHidden("operator-indicator");
  });

  it("does not display the equals indicator on start up", () => {
    assertElementIsHidden("equals");
  });
});
