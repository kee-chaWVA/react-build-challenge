import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Button from './Button'
import NavItem from "./NavItem"
import '../styles/Navbar.css'

export default function Navbar() {
  const { isAuthenticated, logout, isInitialized } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  if (!isInitialized) return null

  return (
    <nav aria-label="Main navigation" className="navbar">
      <div className="nav-logo-container">
        <img
          src="/logo.svg"
          alt="App logo"
          className="navbar-logo"
        />
        <NavLink to="/" className="logo">
          <div className="logo-text">
            <span className="logo-react">React</span>
            <span className="logo-name">Hodgepodge</span>
          </div>
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li><NavItem to="/">Home</NavItem></li>
        <li><NavItem to="/about">About Us</NavItem></li>
        <li><NavItem to="/contact-us">Contact</NavItem></li>

        {isAuthenticated ? (
          <>
            <li><NavItem to="/pokemon">Pokémon Encyclopedia</NavItem></li>
            <li><NavItem to="/search">Movie Library</NavItem></li>
            <li><NavItem to="/quotes">Quotes</NavItem></li>
            <li>
              <Button onClick={handleLogout}>Logout</Button>
            </li>
          </>
        ) : (
          <li><NavItem to="/login">Login</NavItem></li>
        )}
      </ul>
    </nav>
  )
}
