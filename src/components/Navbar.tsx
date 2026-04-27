import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from './Button'
import NavItem from "./NavItem"

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth() 
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <nav aria-label="Main navigation">
      {isAuthenticated ? (
        <>
          <NavItem to='/search'>Movie Library</NavItem>
          <NavItem to='/quotes'>Quotes</NavItem>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <NavItem to='/login'>Login</NavItem>
      )
    }
    </nav>
  )
}