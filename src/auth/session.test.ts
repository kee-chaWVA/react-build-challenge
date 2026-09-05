import { describe, expect, it, beforeEach } from "vitest";
import { getSession, storeSession, clearSession } from "./session";

beforeEach(() => {
  clearSession();
});

const userID = crypto.randomUUID();

describe("session", () => {
  it("sets user session to localStorage", () => {
    storeSession(userID);
    const session = getSession();

    expect(session).toBe(userID);
  });

  it.each(["", "  "])("returns null when storeSession is called with %j", (input) => {
    storeSession(input);
    const retrievedSession = getSession();

    expect(retrievedSession).toBeNull();
  });

  it("clears the session", () => {
    storeSession(userID);
    clearSession();
    const retrievedSession = getSession();

    expect(retrievedSession).toBeNull();
  })
})