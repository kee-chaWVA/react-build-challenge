import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";

type NavItemProps = {
  to: string;
  children: ReactNode;
};

const StyledNavLink = styled(NavLink)(({ theme }) => {
  const palette = theme.vars?.palette ?? theme.palette;
  const isDark = theme.palette.mode === "dark";

  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 4px",

    textDecoration: "none",
    fontWeight: 500,

    // ✅ Chrome-aware text color
    color: isDark
      ? palette.common.white
      : palette.text.primary,

    transition: "opacity 150ms ease",

    "&:hover": {
      opacity: 0.85,
    },

    "&.active": {
      fontWeight: 600,
      opacity: 1,
    },
  };
});

export default function NavItem({ to, children }: NavItemProps) {
  return (
    <StyledNavLink
      to={to}
      data-nav-item
    >
      {children}
    </StyledNavLink>
  );
}
