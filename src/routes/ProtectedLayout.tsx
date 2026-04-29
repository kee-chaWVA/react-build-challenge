import { useAuth } from "../auth/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedLayout() {
  const { isAuthenticated, isInitialized } = useAuth()
  
  if (!isInitialized) {
    return(
      <>
        <h3>LOADING...</h3>
      </>
    )
  }

  if (!isAuthenticated ){
    return (
      <Navigate to='/login' replace/>
    )
  }
  return<Outlet/>
}