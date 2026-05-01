import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";
import Card from "../components/Card";
import Grid from "@mui/material/Grid";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userNameInput, setUserNameInput] = useState("");
  const [userPw, setUserPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const foundUser = users.find(
      (user) => user.userName === userNameInput.trim()
    );

    if (!foundUser) {
      setError("User not found!");
      return;
    }

    setError("");
    login(foundUser);
    navigate("/");
  };

  return (
    <div className="login-page">
      <Card variant="outlined">
        <h2 className="page-title">Log In</h2>

        <form onSubmit={handleLogin}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            {/* Error message */}
            {error && (
              <Grid size={12}>
                <p id="login-error" aria-live="assertive">
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
          </Grid>
        </form>
      </Card>
    </div>
  );
}