import {
  generateSecret,
  generateURI,
  verify
} from "otplib";
import QRCode from "qrcode";

interface VerifyOtpResult {
  success: boolean;
  error?: string;
}

const STORAGE_KEY = "totp_secret";

export function getSecret(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function trustDevice(userName: string): void {
  localStorage.setItem(`trusted_device_${userName}`, "true");
}

export function isTrustedDevice(userName: string): boolean {
  return localStorage.getItem(`trusted_device_${userName}`) === "true";
}

export function forgetTrustedDevice(userName: string): void {
  localStorage.removeItem(`trusted_device_${userName}`);
}

export function getOrCreateSecret(): string {
  const existingSecret = getSecret()
  if (existingSecret) {
    return existingSecret;
  }

  const secret = generateSecret();

  localStorage.setItem(STORAGE_KEY, secret);

  return secret;
}

export function getAuthenticatorUri() {
  const secret = getOrCreateSecret();

  return generateURI({
    secret,
    issuer: "React Hodgepodge",
    label: "kee@reacthodgepodge.dev",
  });
}

export async function generateQrCode() {
  const uri = getAuthenticatorUri();

  return await QRCode.toDataURL(uri);
}

export async function verifyOtp(token: string): Promise<VerifyOtpResult> {
  const secret = getOrCreateSecret();
  const result = await verify({
    token,
    secret,
  });

  if (result.valid) {
    return {
      success: true
    }
  }

  return {
    success: false,
    error: "Invalid Code. Please try again."
  };
}