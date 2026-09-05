import { describe, it, expect, beforeEach } from "vitest";
import { clearToken, createToken, getToken, storeToken } from "./token";

beforeEach(() => {
  clearToken()
})

describe("token", () => {
  it("sets token to localStorage", () => {
    storeToken('abc-123');
    const token = getToken()

    expect(token).toBe("abc-123")
  });

  it("returns nothing if nothing is stored in localStorage", () => {
    const token = getToken();

    expect(token).toBeNull();
  })

  it("creates a uuid token", () => {
    const token = createToken();
    const tokenRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i 

    expect(token).toMatch(tokenRegex);
  });

  it("creates a unique token not duplicated", () => {
    const token1 = createToken();
    const token2 = createToken();

    expect(token1).not.toBe(token2);
  });

  it("clears the token", () => {
    const token = createToken();
    storeToken(token)
    clearToken();
    const retrievedToken = getToken()

    expect(retrievedToken).toBeNull();
  });
})