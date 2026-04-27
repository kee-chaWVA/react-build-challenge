import { useAuth } from "../contexts/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated){
    return (
      <Navigate to='/login' replace/>
    )
  }
  return<Outlet/>
}