import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  /* =========================================================
     PALETTE (COLORS)
     ========================================================= */
  palette: {
    mode: "light", // keep light for now
    primary: {
      main: "#aa3bff", // matches your --accent
    },
    secondary: {
      main: "#6b6375",
    },
  },

  /* =========================================================
     TYPOGRAPHY
     ========================================================= */
  typography: {
    fontFamily: "system-ui, Segoe UI, Roboto, sans-serif",

    // Only override button text
    button: {
      textTransform: "none", // remove MUI uppercase
      fontWeight: 500,
    },
  },

  /* =========================================================
     SHAPE
     ========================================================= */
  shape: {
    borderRadius: 8,
  },

  /* =========================================================
     COMPONENT OVERRIDES
     ========================================================= */
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          fontSize: "0.95rem",
        },
        contained: {
          boxShadow:
            "rgba(0, 0, 0, 0.12) 0 6px 12px -3px",

          "&:hover": {
            boxShadow:
              "rgba(0, 0, 0, 0.18) 0 10px 16px -3px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "30px",
          backgroundColor: "background.paper",
          boxShadow:
            "rgba(0, 0, 0, 0.08) 0px 8px 16px -4px"
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        },
      },
    },  
  },
});