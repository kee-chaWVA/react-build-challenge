import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Grid from "@mui/material/Grid";
import Modal from "../components/Modal";
import OtpForm from "../components/OtpForm";
import '../styles/LoginPage.css'
import '../styles/form.css'
import { isTrustedDevice } from "../services/totpService";
import { useNavigate, Link } from "react-router-dom";
import type { User } from "../types/user";
import { useQuery } from "@tanstack/react-query";
import { STORES, getAll } from "../data/appDb";
import { verifyTwoFactor } from "../features/security/securitySlice";
import { useDispatch } from "react-redux";
import { hashPassword } from "../shared/utils/passwordUtils";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate()
  const [userNameInput, setUserNameInput] = useState("");
  const [userPw, setUserPw] = useState("");
  const [error, setError] = useState("");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null)
  const dispatch = useDispatch();

  const {data: users = []} = useQuery({
    queryKey: ['users'],
    queryFn: () => getAll<User>(STORES.USERS)
  })

  
  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    
    const passwordDigest = await hashPassword(userPw)
    const foundUser = users.find(
      (user) => user.userName === userNameInput.trim() &&
      user.passwordDigest === passwordDigest
    );

    if (!foundUser) {
      setError("Invalid username or password.");
      return;
    }

    setError("");
    if(isTrustedDevice(foundUser.userName)) {
      login(foundUser);
      dispatch(verifyTwoFactor())
      navigate("/")
    } else {
      setPendingUser(foundUser)
      setIsOtpOpen(true);
    }
  };

  const handleOtpSuccess = () => {
    if (!pendingUser) return;

    login(pendingUser)
    dispatch(verifyTwoFactor());
    setPendingUser(null)
    setIsOtpOpen(false)

    navigate("/");
  }

  return (
    <div className="login-page">
      <Card variant="outlined" className="login-card">
        <h2 className="page-title">Log In</h2>

        <form onSubmit={handleLogin}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            {/* Error message */}
            {error && (
              <Grid size={12}>
                <p 
                  id="login-error"
                  aria-live="assertive"
                  className="form-error-message"
                >
                  {error}
                </p>
              </Grid>
            )}

            {/* Username */}
            <Grid size={4}>
              <label htmlFor="user-login">User Name</label>
            </Grid>
            <Grid size={8}>
              <input
                id="user-login"
                type="text"
                value={userNameInput}
                onChange={(e) => {
                  setError("");
                  setUserNameInput(e.target.value);
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "login-error" : undefined}
                autoComplete="username"
                required
                style={{ width: "100%" }}
              />
            </Grid>

            {/* Password */}
            <Grid size={4}>
              <label htmlFor="user-pw">Password</label>
            </Grid>
            <Grid size={8}>
              <input
                id="user-pw"
                type="password"
                value={userPw}
                onChange={(e) => {
                  setError("");
                  setUserPw(e.target.value);
                }}
                autoComplete="current-password"
                required
                style={{ width: "100%" }}
              />
            </Grid>

            {/* Submit button */}
            <Grid
              size={12}
              sx={{ display: "flex", justifyContent: "center", mt: 1 }}
            >
              <Button type="submit">Log In</Button>
            </Grid>
            <Grid
              size={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2
              }}
            >
              <Link to="/register">
                Create Account
              </Link>
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
            onSuccess={handleOtpSuccess}
          />
        </Modal>
    </div>
  );
}