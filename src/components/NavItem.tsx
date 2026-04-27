import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import '../NavItem.css'

type NavProps = {
  to: string
  children: ReactNode
}

export default function NavItem({to, children}: NavProps) {
  return (
    <NavLink to={to} className={({ isActive }) => isActive ? 'active' : undefined} >
      {children}
    </NavLink>
  )
}