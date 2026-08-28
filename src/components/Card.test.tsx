import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Card from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        Hello World
      </Card>
    );

    expect(
      screen.getByText("Hello World")
    ).toBeTruthy();
  });

  it("fowards className", () => {
    render(
      <Card className="test-card">
        Hello
      </Card>
    );

    expect(
      document.querySelector(".test-card")
    ).toBeTruthy();
  });

  it("renders outlined variant", () => {
    render(
      <Card variant="outlined">
        Hello
      </Card>
    );
  
    const card =
      screen.getByText("Hello").closest(".MuiCard-root");
  
    expect(card?.className)
      .toContain("MuiPaper-outlined");
  });

  it("renders elevation variant by default", () => {
    render(
      <Card>
        Hello
      </Card>
    );
  
    const card =
      screen.getByText("Hello").closest(".MuiCard-root");
  
    expect(card?.className)
      .toContain("MuiPaper-elevation");
  });
})