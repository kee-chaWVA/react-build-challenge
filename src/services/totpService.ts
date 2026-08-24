import {
  generateSecret,
  generateURI,
  verify
} from "otplib";
import QRCode from "qrcode";

const STORAGE_KEY = "totp_secret";

export function getOrCreateSecret(): string {
  const existingSecret = localStorage.getItem(STORAGE_KEY);

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

export async function verifyOtp(token: string): Promise<boolean> {
  const secret = getOrCreateSecret();
  const resut = await verify({
    token,
    secret,
  });
  return resut.valid
}