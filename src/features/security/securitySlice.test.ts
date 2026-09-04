import { describe, it, expect } from "vitest";
import reducer, {
  verifyTwoFactor,
  resetTwoFactor
} from "./securitySlice";

describe("securitySlice", () => {
  it("verifies two factor", () => {
    const state = reducer(
      undefined,
      verifyTwoFactor()
    );

    expect(
      state.isTwoFactorVerified
    ).toBe(true);
  });

  it("resets two factor", () => {
    const state = reducer(
      {
        isTwoFactorVerified: true,
        rememberBrowser: false,
        verifiedUntil: null,
      },
      resetTwoFactor()
    );

    expect(
      state.isTwoFactorVerified
    ).toBe(false);
  });
});