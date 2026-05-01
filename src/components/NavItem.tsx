import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavItem.css";

type NavProps = {
  to: string;
  children: ReactNode;
};

export default function NavItem({ to, children }: NavProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "nav-item active" : "nav-item"
      }
    >
      {children}
    </NavLink>
  );
}