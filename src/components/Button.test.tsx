import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import Button from "./Button";

describe("Button", () => {
  it("renders button text", () => {
    render(
      <Button>
        Log In
      </Button>
    );

    expect(
      screen.getByRole("button", {
        name: /log in/i
      })
    ).toBeTruthy();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn()

    render(
      <Button onClick={handleClick}>
        Save
      </Button>
    );

    await user.click(
      screen.getByRole("button", {
        name: /save/i
      })
    )
    expect(handleClick).toHaveBeenCalledOnce();
  });
});