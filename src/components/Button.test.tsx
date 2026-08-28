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
    );
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("returns secondary if variant is secondary", () => {
    render(
      <Button variant="secondary">
        Save
      </Button>
    );

    const button = screen.getByRole("button", {
      name: /save/i
    });

    expect(button.className).toContain("MuiButton-colorSecondary");
  })

  it("returns text if variant is text", () => {
    render(
      <Button variant="text">
        Save
      </Button>
    );

    const button = screen.getByRole("button", {
      name: /save/i
    });

    expect(button.className).toContain("MuiButton-text");
  })

  it("returns contained if variant is not present", () => {
    render(
      <Button>
        Save
      </Button>
    );

    const button = screen.getByRole("button", {
      name: /save/i
    });

    expect(button.className).toContain("MuiButton-contained");
  });

  it("returns primary if variant is not present", () => {
    render(
      <Button>
        Save
      </Button>
    );

    const button = screen.getByRole("button", {
      name: /save/i
    });

    expect(button.className).toContain("MuiButton-colorPrimary");
  })
});