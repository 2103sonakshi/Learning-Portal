import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import {
  AccountCircle,
  VpnKey,
  Brightness4,
  WbSunny,
  Login,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// The component now accepts `darkMode` and `setDarkMode` as props.
function LoginForm({ onLogin, switchToSignup, darkMode, setDarkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // The local `darkMode` state is removed.
  // const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the theme toggle
  const handleThemeToggle = () => {
    // This calls the `setDarkMode` function from the parent App component
    setDarkMode(!darkMode);
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: "bold", mr: 1 }}
          >
            Login to Learning Portal
          </Typography>
          <span role="img" aria-label="key">
            🔑
          </span>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <AccountCircle sx={{ color: "action.active", mr: 1 }} />
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <VpnKey sx={{ color: "action.active", mr: 1 }} />,
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
            }}
            startIcon={loading ? null : <Login />}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            width: "100%",
          }}
        >
          <Button onClick={switchToSignup} sx={{ mb: 1 }}>
            New user? Signup here
          </Button>
          <Button
            onClick={handleThemeToggle} // Use the new handler function
            startIcon={darkMode ? <WbSunny /> : <Brightness4 />}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginForm;
