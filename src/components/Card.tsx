import type { ReactNode } from "react";
import MuiCard from "@mui/material/Card";
import type { CardProps as MuiCardProps } from "@mui/material/Card";

type CardProps = {
  children: ReactNode;
  variant?: "default" | "outlined";
} & Omit<MuiCardProps, "variant">;

export default function Card({
  children,
  variant = "default",
  sx,
  ...rest
}: CardProps) {
  return (
    <MuiCard
      {...rest}
      variant={variant === "outlined" ? "outlined" : "elevation"}
      sx={[
        {
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </MuiCard>
  );
}
