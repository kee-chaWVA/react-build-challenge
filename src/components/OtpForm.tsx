import { useState, useEffect } from "react";
import OtpInput from 'react-otp-input';
import Button from "./Button";
import { generateQrCode, verifyOtp } from "../services/totpService";
import { useDispatch } from "react-redux";
import { verifyTwoFactor } from "../features/security/securitySlice";
import { useNavigate } from "react-router-dom";
import "../styles/OtpForm.css";

type OtpFormProps = {
  onSuccess: () => void
}

export default function OtpForm({onSuccess}: OtpFormProps) {
  const [ otp, setOtp ] = useState('')
  const [ qrCode, setQrCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVerify = async() => {
    const valid = await verifyOtp(otp)
    console.log("Valid OTP?", valid);
    if (valid) {
      dispatch(verifyTwoFactor());
      onSuccess();
      navigate("/");
    }
  }

  useEffect(() => {
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
          Scan the QR code with Microsoft Authenticator
          or Google Authenticator
        </p>
      </div>

      {qrCode && (
        <img
          src={qrCode}
          className="otp-qa"
          alt="Authenticator QR Code"
        />
      )}

      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderInput={(props) => (
          <input
            {...props}
            className="otp-input"
          />
        )}
      />

      <Button
        variant="primary"
        onClick={handleVerify}
      >
        Verify
      </Button>
    </div>
  )
}