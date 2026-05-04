import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  
  cssVariables: {
    // Use class on <html> so you can toggle: .light / .dark
    colorSchemeSelector: "class",
  },
  
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#aa3bff" },
        secondary: { main: "#6b6375" },

        // Stronger text for readability (fixes “too light” titles)
        text: {
          primary: "rgba(0,0,0,0.88)",
          secondary: "rgba(0,0,0,0.72)",
        },
        
        background: {
          default: "#f4f5f8",
          paper: "#ffffff",
        },
    

        error: {
          main: "#d32f2f",
          light: "#fdecea",
          dark: "#9a0007",
        },
      },
    },

    dark: {
      palette: {
        primary: { main: "#c084fc" },   // your dark accent
        secondary: { main: "#9ca3af" }, // neutral

        background: {
          default: "#14151b",
          paper: "#1f2028",
        },        

        text: {
          primary: "rgba(255,255,255,0.90)",
          secondary: "rgba(255,255,255,0.72)",
        },

        divider: "rgba(255,255,255,0.14)",

        error: {
          main: "#ff6b6b",
          light: "rgba(255,107,107,0.15)",
          dark: "#c62828",
        },
      },
    },
  },


  /* =========================================================
     TYPOGRAPHY
     ========================================================= */
  typography: {
    fontFamily: "system-ui, Segoe UI, Roboto, sans-serif",

    h6: {
      fontWeight: 600,
    },
  
    button: {
      textTransform: "none",
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
    MuiCardContent: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-primary)",
        },
      },
    },
  },
});