import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Button from './Button'
import NavItem from "./NavItem"

export default function Navbar() {
  const { isAuthenticated, logout, isInitialized } = useAuth() 
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  if (!isInitialized) {
    return null
  }

  return (
    <nav aria-label="Main navigation">
      <NavItem to='/'>Home</NavItem>
      <NavItem to='/about'>About Us</NavItem>
      <NavItem to='/contact-us'>Contact</NavItem>
      {isAuthenticated ? (
        <>
          <NavItem to='/search'>Movie Library</NavItem>
          <NavItem to='/quotes'>Quotes</NavItem>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>
          <NavItem to='/login'>Login</NavItem>
        </>
      )
    }
    </nav>
  )
}