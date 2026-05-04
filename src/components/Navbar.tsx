import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Button from "./Button";
import NavItem from "./NavItem";
import { styled } from "@mui/material/styles";
import { useLayoutEffect, useRef } from "react";
import "../styles/Navbar.css";

const NavbarRoot = styled("header")(({ theme }) => {
  const palette = theme.vars?.palette ?? theme.palette;

  return {
    width: "100%",
    backgroundColor: palette.background.default,
    color: palette.text.primary,
  };
});


export default function Navbar() {
  const { isAuthenticated, logout, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };
  
  useLayoutEffect(() => {
    if (!isInitialized) return;
  
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
  
    const getActiveLink = () =>
      nav.querySelector<HTMLAnchorElement>('a[data-nav-item][aria-current="page"]') ??
      nav.querySelector<HTMLAnchorElement>("a.active[data-nav-item]");
  
    const updateToLink = (link: HTMLAnchorElement | null) => {
      if (!link) {
        indicator.style.opacity = "0";
        return;
      }
      const { offsetLeft, offsetWidth } = link;
      indicator.style.opacity = "1";
      indicator.style.transform = `translateX(${offsetLeft}px)`;
      indicator.style.width = `${offsetWidth}px`;
    };
  
    // 1) Set indicator to active route
    const setToActive = () => updateToLink(getActiveLink());
  
    // Run now + next frame (covers late DOM settling)
    setToActive();
    const raf = requestAnimationFrame(setToActive);
  
    // 2) Hover preview using event delegation (no per-link listeners)
    const onPointerOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a[data-nav-item]") as HTMLAnchorElement | null;
      if (link) updateToLink(link);
    };
  
    const onPointerLeave = () => {
      setToActive();
    };
  
    nav.addEventListener("pointerover", onPointerOver);
    nav.addEventListener("pointerleave", onPointerLeave);
  
    // 3) Keep correct on resize
    window.addEventListener("resize", setToActive);
  
    return () => {
      cancelAnimationFrame(raf);
      nav.removeEventListener("pointerover", onPointerOver);
      nav.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", setToActive);
    };
  }, [location.pathname, isAuthenticated, isInitialized]);
  
  if (!isInitialized) return null;

  return (
    <NavbarRoot>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="navbar"
      >
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

        <div ref={indicatorRef} className="nav-indicator" />
      </nav>
    </NavbarRoot>
  );
}