import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert, // Make sure to import Alert
} from "@mui/material";
import {
  AccountCircle,
  VpnKey,
  Brightness4,
  WbSunny,
  Login,
  PersonAdd,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

function SignupForm({ onSignup, switchToLogin, darkMode, setDarkMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // The state for your error message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);
    try {
      await onSignup(name, email, password);
    } catch (err) {
      // Set the error state with the message from the backend
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
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
            Create Your Account
          </Typography>
          <span role="img" aria-label="sparkles">
            ✨
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
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
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
          {/* Display the error message here */}
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
            startIcon={loading ? null : <PersonAdd />}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign Up"
            )}
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
          <Button onClick={switchToLogin} sx={{ mb: 1 }}>
            Already have an account? Login here
          </Button>
          <Button
            onClick={handleThemeToggle}
            startIcon={darkMode ? <WbSunny /> : <Brightness4 />}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignupForm;
