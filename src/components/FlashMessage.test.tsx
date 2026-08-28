import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import FlashMessage from "./FlashMessage";

describe("FlashMessage", () => {
  it("renders the message", () => {
    render(
      <FlashMessage message="Something went wrong."/>
    );

    expect(
      screen.getByText("Something went wrong.")
    ).toBeTruthy();
  });

  it("renders nothing when message is empty", () => {
    render(
      <FlashMessage
        message=""
      />
    );
  
    expect(
      screen.queryByRole("alert")
    ).toBeNull();
  });

  it("renders close button when onClose is provided", () => {
    render(
      <FlashMessage
        message="Error"
        onClose={() => {}}
      />
    );
  
    expect(
      screen.getByRole("button", {
        name: /close message/i
      })
    ).toBeTruthy();
  });

  it("does not render close button when onClose is not provided", () => {
    render(
      <FlashMessage
        message="Error"
      />
    );
  
    expect(
      screen.queryByRole("button", {
        name: /close message/i
      })
    ).toBeNull();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
  
    render(
      <FlashMessage
        message="Error"
        onClose={handleClose}
      />
    );
  
    await user.click(
      screen.getByRole("button", {
        name: /close message/i
      })
    );
  
    expect(handleClose).toHaveBeenCalledOnce();
  });
  
  it("auto closes after duration", () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    render(
      <FlashMessage
        message="Error"
        autoHideDuration={3000}
        onClose={handleClose}
      />
    );
  
    vi.advanceTimersByTime(3000);
    expect(handleClose).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it("defaults severity to error", () => {
    render(
      <FlashMessage
        message="Something broke"
      />
    );
  
    const alert = screen.getByRole("alert");
  
    expect(alert.className).toContain("MuiAlert-colorError");
    expect(alert.className).toContain("MuiAlert-filled");
  });

  it("uses success severity when provided", () => {
    render(
      <FlashMessage
        message="Success!"
        severity="success"
      />
    );
  
    const alert = screen.getByRole("alert");
  
    expect(alert.className).toContain("MuiAlert-colorSuccess");
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
  
    render(
      <FlashMessage
        message="Error"
        onClose={handleClose}
      />
    );
  
    await user.click(
      screen.getByRole("button", {
        name: /close message/i,
      })
    );
  
    expect(handleClose).toHaveBeenCalledOnce();
  });
})