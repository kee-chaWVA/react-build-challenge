import MuiButton from "@mui/material/Button";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

type ButtonProps = {
  variant?: "primary" | "secondary" | "text";
} & Omit<MuiButtonProps, "variant" | "color">;

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, Pick<MuiButtonProps, "variant" | "color">> = {
  primary: {variant: "contained", color: "primary"},
  secondary: {variant: "contained", color: "secondary"},
  text: {variant: "text", color: "primary"}
}

export default function Button({
  children,
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <MuiButton
      {...rest}
      {...VARIANT_STYLES[variant]}
    >
      {children}
    </MuiButton>
  );
}