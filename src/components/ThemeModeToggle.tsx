import Button from "@mui/material/Button";
import { useColorScheme } from "@mui/material/styles";

export function ThemeModeToggle() {
  const { mode, setMode } = useColorScheme();

  if (!mode) return null;

  return (
    <Button
      variant="contained"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
    >
      {mode === "dark" ? "Light mode" : "Dark mode"}
    </Button>
  );
}