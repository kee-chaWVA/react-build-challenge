import { describe, it, expect } from "vitest";
import { getPasswordRequirements, hashPassword } from "./passwordUtils";

describe("getPasswordRequirements", () => {
  it("returns valid for a strong password", () => {
    const result = getPasswordRequirements("Password123.");
    expect(result.isValid).toBe(true);
  });

  it("fails when missing uppercase", () => {
    const result = getPasswordRequirements("password123.");
    expect(result.hasUpperCase).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it("fails when missing lowercase", () => {
    const result = getPasswordRequirements("PASSWORD123.");
    expect(result.hasLowerCase).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it("fails when missing number", () => {
    const result = getPasswordRequirements("Password.");
    expect(result.hasNumber).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it("fails when missing special character", () => {
    const result = getPasswordRequirements("Password123");
    expect(result.hasSpecial).toBe(false);
    expect(result.isValid).toBe(false);
  });

  it("fails when password length is under 8 characters", () => {
    const result = getPasswordRequirements("p123.");
    expect(result.hasMinLength).toBe(false);
    expect(result.isValid).toBe(false);
  });
  
  it("passes when password is exactly 8 characters", () => {
    const result = getPasswordRequirements("Wisvis1!");
    expect(result.hasMinLength).toBe(true)
    expect(result.isValid).toBe(true);
  });
  
  it("passes when password is more than 8 characters", () => {
    const result = getPasswordRequirements("newPassword123.")
    expect(result.hasMinLength).toBe(true)
    expect(result.isValid).toBe(true)
  });
  
  it("fails if password is empty", () => {
    const result = getPasswordRequirements("");
    expect(result.hasMinLength).toBe(false);
    expect(result.isValid).toBe(false);
  });
  
  it("fails if password has only whitespaces", () => {
    const result = getPasswordRequirements("   ");
    expect(result.hasMinLength).toBe(false);
    expect(result.isValid).toBe(false);
  });
});

describe("hashPassword", () => {
  it("returns the same hash for the same password", async () => {
    const hash1 = await hashPassword("Password123.");
    const hash2 = await hashPassword("Password123.");
    expect(hash1).toBe(hash2);
  });

  it("returns different hash for different passwords", async () => {
    const hash1 = await hashPassword("Password456.");
    const hash2 = await hashPassword("Password123.");
    expect(hash1).not.toBe(hash2);
  });

  it("returns a non-empty hash", async () => {
    const hash =  await hashPassword("Password123.")
    expect(hash.length).toBeGreaterThan(0);
  });
});
