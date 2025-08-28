import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#4caf50",
    },
    background: {
      default: "#ffffff",
      paper: "#f0f0f0",
    },
    text: {
      primary: "#000000",
      secondary: "#555",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#81c784",
    },
    background: {
      default: "#121212",
      paper: "#2a2a2a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
});

export { lightTheme, darkTheme };
