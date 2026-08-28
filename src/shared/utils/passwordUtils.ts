export type PasswordRequirements = {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export function getPasswordRequirements(password: string): PasswordRequirements{
  const hasMinLength = password.length>= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z\d]/.test(password);
  return {
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecial,
    isValid:
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecial
  }
}

export async function hashPassword(password: string): Promise<string> {
  const encodedPassword = new TextEncoder();
  const data = encodedPassword.encode(password);
  const sha256DigestBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );
  const digestBytes = new Uint8Array(sha256DigestBuffer);

  const passwordDigest = Array.from(digestBytes).map(
    byte => byte.toString(16).padStart(2,"0")
  ).join("")

  return passwordDigest
}