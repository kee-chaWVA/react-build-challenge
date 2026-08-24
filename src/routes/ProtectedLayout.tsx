import { useAuth } from "../auth/AuthContext"
import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export default function ProtectedLayout() {
  const { isAuthenticated, isInitialized } = useAuth()

  const isTwoFactorVerified = useSelector(
    (state: RootState) => state.security.isTwoFactorVerified
  );
  ``
  
  if (!isInitialized) {
    return <h3>LOADING...</h3>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isTwoFactorVerified) {
    return <h3>Waiting for 2FA...</h3>;
  }
  
  return <Outlet />;
}