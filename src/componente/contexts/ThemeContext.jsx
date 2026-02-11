import React, { createContext, useState, useContext } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = createTheme({
    // Breakpoints padrão do MUI (explícito para clareza)
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },

    // Paleta de cores
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#1976d2",
        light: "#42a5f5",
        dark: "#1565c0",
      },
      secondary: {
        main: "#dc004e",
        light: "#f50057",
        dark: "#c51162",
      },
      error: {
        main: "#f44336",
        light: "#e57373",
        dark: "#d32f2f",
      },
      warning: {
        main: "#ff9800",
        light: "#ffb74d",
        dark: "#f57c00",
      },
      success: {
        main: "#4caf50",
        light: "#81c784",
        dark: "#388e3c",
      },
      background: {
        default: isDarkMode ? "#121212" : "#fafafa",
        paper: isDarkMode ? "#1e1e1e" : "#ffffff",
      },
    },

    // Tipografia responsiva
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
        "@media (max-width:600px)": {
          fontSize: "1.75rem",
        },
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 700,
        "@media (max-width:600px)": {
          fontSize: "1.5rem",
        },
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.25rem",
        },
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1.125rem",
        },
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "1rem",
        },
      },
      h6: {
        fontSize: "1.125rem",
        fontWeight: 600,
        "@media (max-width:600px)": {
          fontSize: "0.938rem",
        },
      },
      body1: {
        fontSize: "1rem",
        "@media (max-width:600px)": {
          fontSize: "0.938rem",
        },
      },
      body2: {
        fontSize: "0.875rem",
        "@media (max-width:600px)": {
          fontSize: "0.813rem",
        },
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
    },

    // Componentes personalizados
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
            "@media (max-width:600px)": {
              padding: "6px 12px",
              fontSize: "0.875rem",
            },
          },
          sizeLarge: {
            padding: "12px 24px",
            "@media (max-width:600px)": {
              padding: "10px 20px",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          fullWidth: true,
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            "@media (max-width:600px)": {
              paddingLeft: 16,
              paddingRight: 16,
            },
          },
        },
      },
    },

    // Espaçamento consistente
    spacing: 8, // 1 unit = 8px
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
