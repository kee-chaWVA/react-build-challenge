import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonProps = {
  variant?: "primary" | "secondary" | "text";
} & Omit<MuiButtonProps, "variant" | "color">;

function mapVariant(variant: ButtonProps["variant"]) {
  if (variant === "text") return "text";
  return "contained";
}

function mapColor(variant: ButtonProps["variant"]) {
  if (variant === "secondary") return "secondary";
  return "primary";
}

export default function Button({
  children,
  variant,
  ...rest
}: ButtonProps) {
  return (
    <MuiButton
      {...rest}
      variant={mapVariant(variant)}
      color={mapColor(variant)}
    >
      {children}
    </MuiButton>
  );
}