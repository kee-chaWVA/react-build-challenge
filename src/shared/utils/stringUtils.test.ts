import { describe, it, expect } from "vitest";
import { capitalize } from "./stringUtils";

describe("capitalize", () => {
  it("returns an empty string when passed an empty string", () => {
    const result = capitalize("")

    expect(result).toBe("")
  });

  it("returns an empty string when passed a string with only spaces", () => {
    const result = capitalize("   ")

    expect(result).toBe("");
  });

  it("uppercases the first letter, leaves the rest lowercase for a lowercase word", () => {
    const result = capitalize("hello");

    expect(result).toBe("Hello");
  });

  it("uppercases the first letter and lowercases the rest for an uppercase word", () => {
    const result = capitalize("HELLO")

    expect(result).toBe("Hello");
  });

  it("return uppercase word if word length is equal to 1", () => {
    const result = capitalize("a");

    expect(result).toBe("A");
  });

  it("uppercases the first letter and lowercases the rest for a mixed upper and lower case word", () => {
    const result = capitalize("heLLo");

    expect(result).toBe("Hello");
  });
})