import { useState, useEffect } from "react";
import OtpInput from 'react-otp-input';
import Button from "./Button";
import { generateQrCode, verifyOtp, getSecret, trustDevice } from "../services/totpService";
import "../styles/OtpForm.css";
import '../styles/form.css'
import Grid from "@mui/material/Grid";
import type { User } from "../types/user";

type OtpFormProps = {
  user: User | null;
  onSuccess: () => void
}

export default function OtpForm({user, onSuccess}: OtpFormProps) {
  const [ otp, setOtp ] = useState('')
  const [ qrCode, setQrCode] = useState("");
  const [error, setError] = useState('')
  const [rememberDevice, setRememberDevice] = useState(false);
  const hasSecret = !!getSecret();

  const handleVerify = async() => {
    const result = await verifyOtp(otp)
    if (!user) {
      setError("Authentication session expired.")
      return
    }
    if (result.success) {
      if (rememberDevice && user) {
        trustDevice(user.userName)
      }
      setError('')
      onSuccess();
    } else {
      setError(result.error ?? "Verification failed")
    }
  }

  useEffect(() => {
    if (hasSecret) return;
    const loadQrCode = async () => {
      const qr = await generateQrCode();
      setQrCode(qr);
    };

    loadQrCode();
  }, []);

  return (
    <div className="otp-form">
      <div className="otp-header">
        <p>
          {hasSecret 
          ? "Please enter your verification code."
          :"Scan the QR code with Microsoft Authenticator or Google Authenticator."
          }
        </p>
      </div>

      {qrCode && (
        <img
          src={qrCode}
          className="otp-qa"
          alt="Authenticator QR Code"
        />
      )}
      {error && (
        <Grid size={12}>
          <p
            id="otp-error"
            aria-live="assertive"
            className="form-error-message"
          >
            {error}
          </p>
        </Grid>
      )}
      <div className="otp-input-section">
        <OtpInput
          value={otp}
          onChange={(value) => {
            setOtp(value)
            if (error) {
              setError('')
            }
          }}
          shouldAutoFocus={true}
          numInputs={6}
          renderInput={(props) => (
            <input
              {...props}
              className="otp-input"
            />
          )}
        />
      <div className="verify-action">
        <Button
          variant="primary"
          onClick={handleVerify}
          fullWidth
        >
          Verify
        </Button>
      </div>
        <label className="remember-device">
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
          />
          Remember this device
        </label>
      </div>
    </div>
  )
}