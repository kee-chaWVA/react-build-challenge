import { useState } from "react"
import { getPasswordRequirements, hashPassword } from "../shared/utils/passwordUtils";
import { useQuery } from "@tanstack/react-query";
import { addRecord, getAll, STORES } from "../data/appDb";
import type { User } from "../types/user";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Grid from "@mui/material/Grid";
import Button from "../components/Button";
import '../styles/RegisterPage.css'
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Modal from "../components/Modal";
import OtpForm from "../components/OtpForm";
import { verifyTwoFactor } from "../features/security/securitySlice";
import { useAuth } from "../auth/AuthContext";
import { useDispatch } from "react-redux";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const dispatch = useDispatch();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getAll<User>(STORES.USERS)
  });

  const existingUser = users.find(
    user => user.userName.toLowerCase() === userName.trim().toLowerCase()
  );

  const passwordMismatched = password.trim() !== confirmPassword.trim();

  const passwordRequirements = getPasswordRequirements(password);

  const passwordRequirementItems = [
    {
      met: passwordRequirements.hasMinLength,
      label: "At least 8 characters",
    },
    {
      met: passwordRequirements.hasUpperCase,
      label: "At least 1 uppercase letter",
    },
    {
      met: passwordRequirements.hasLowerCase,
      label: "At least 1 lowercase letter",
    },
    {
      met: passwordRequirements.hasNumber,
      label: "At least 1 number",
    },
    {
      met: passwordRequirements.hasSpecial,
      label: "At least 1 special character",
    },
  ];
  
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setError("")
      if (existingUser) {
        setError("Username already exist.")
        return
      }
      if (passwordMismatched) {
        setError("Please make sure that password matches.")
        return
      }
      
      if (!passwordRequirements.isValid) {
        setError("Password requirements not met.")
        return
      }
      const passwordDigest = await hashPassword(password)
      
      const newUser: User = {
        id: crypto.randomUUID(),
        userName: userName.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        passwordDigest
      }
  
      await addRecord(STORES.USERS, newUser)
      setPendingUser(newUser);
      setIsOtpOpen(true);
    } catch (error) {
      console.error(error)
      setError("Unable to create user. Please try again")
    }
  }

  const handleEnrollmentSuccess = () => {
    if (!pendingUser) return;

    login(pendingUser);
    dispatch(verifyTwoFactor())
    setIsOtpOpen(false);
    setPendingUser(null);
    navigate("/")
  }

  return (
    <div className="register-page">
      <Card variant="outlined" className="register-card">
        <h2 className="page-title">Create User</h2>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            {/* Error message */}
            {error && (
              <Grid size={12}>
                <p 
                  id="register-error"
                  aria-live="assertive"
                  className="form-error-message"
                >
                  {error}
                </p>
              </Grid>
            )}

            {/* Username */}
            <Grid size={12}>
              <label htmlFor="new-user">User Name</label>
              <input
                id="new-user"
                type="text"
                value={userName}
                onChange={(e) => {
                  setError("");
                  setUserName(e.target.value);
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "register-error" : undefined}
                autoComplete="username"
                required
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid size={6}>
              <label htmlFor="first-name">First Name</label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setError("");
                  setFirstName(e.target.value);
                }}
                required
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid size={6}>
              <label htmlFor="last-name">Last Name</label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setError("");
                  setLastName(e.target.value);
                }}
                required
                style={{ width: "100%" }}
              />
            </Grid>
            {/* Password */}
            <Grid size={12}>
              <label htmlFor="user-pw">Password</label>
              <input
                id="user-pw"
                type="password"
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
                autoComplete="new-password"
                required
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid size={12}>
              <label htmlFor="confirm-pw">
                Confirm Password
              </label>

              <input
                id="confirm-pw"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setError("");
                  setConfirmPassword(e.target.value);
                }}
                autoComplete="new-password"
                required
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid size={12}>
              <div className="password-requirements">
                <h4>Password Requirements</h4>

                <ul>
                  {passwordRequirementItems.map(
                    ({ met, label }) => (
                      <li
                        key={label}
                        className={
                          met
                            ? "requirement-met"
                            : "requirement-missing"
                        }
                      >
                        {met ? <CheckCircleIcon color="success"/> : <CancelIcon color="error"/>} {label}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </Grid>
            {/* Submit button */}
            <Grid
              size={12}
              sx={{ display: "flex", justifyContent: "center", mt: 1 }}
            >
              <Button type="submit">Create User</Button>
            </Grid>
          </Grid>
        </form>
      </Card>
      <Modal
      open={isOtpOpen}
      title="Two Factor Authentication"
      onClose={() => {
        setPendingUser(null)
        setIsOtpOpen(false)
      }}
      >
        <OtpForm
          user={pendingUser}
          onSuccess={handleEnrollmentSuccess}
        />
      </Modal>
    </div>
  )
}