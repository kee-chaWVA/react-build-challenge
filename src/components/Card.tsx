import type { ReactNode } from "react";
import MuiCard from "@mui/material/Card";

type CardProps = {
  children: ReactNode;
  variant?: "default" | "outlined";
  className?: string;
};

export default function Card({
  children,
  variant = "default",
  className,
}: CardProps) {
  return (
    <MuiCard
      className={className}
      variant={variant === "outlined" ? "outlined" : "elevation"}
    >
      {children}
    </MuiCard>
  );
}
