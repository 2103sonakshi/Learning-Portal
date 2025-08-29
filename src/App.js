import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import QuizList from "./components/QuizList";
import TakeQuiz from "./components/TakeQuiz";
import AddQuiz from "./components/AddQuiz";
import AIGenerator from "./components/AIGenerator";
import AIPoweredTools from "./components/AIPoweredTools";
import AISummarizer from "./components/AISummarizer";
import AITutorChatbot from "./components/AITutorChatbot";
import PlagiarismChecker from "./components/PlagiarismChecker";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import SERVER_URL from "./constant.js";
console.log("url", SERVER_URL);
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
    }

    const savedLogin = localStorage.getItem("isLoggedIn") === "true";
    if (savedLogin) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName") || "");
      setUserEmail(localStorage.getItem("userEmail") || "");
      setProfilePic(localStorage.getItem("profilePic") || "");
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(
        "https://learning-portal-server-f232.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );
      setIsLoggedIn(true);
      setUserName(res.data.name || email);
      setUserEmail(email);
      if (res.data.profilePic) {
        const picUrl = `${SERVER_URL}/${res.data.profilePic}`;
        setProfilePic(picUrl);
        localStorage.setItem("profilePic", picUrl);
      }
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", res.data.name || email);
      localStorage.setItem("isLoggedIn", true);
    } catch (err) {
      console.error("Invalid email or password", err);
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      await axios.post(`${SERVER_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      setIsLoggedIn(true);
      setUserName(name);
      setUserEmail(email);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      localStorage.setItem("isLoggedIn", true);
      console.log("Signup successful!");
    } catch (err) {
      console.error(
        err.response?.data?.message || "Signup failed. Please try again.",
        err
      );
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");
    setProfilePic("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.setItem("isLoggedIn", "false");
    sessionStorage.clear();
    localStorage.removeItem("profilePic");
    navigate("/", { replace: true });
    window.location.reload();
  };

  // The conditional rendering logic is now inside the ThemeProvider
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {!isLoggedIn ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          {showSignup ? (
            <SignupForm
              onSignup={handleSignup}
              switchToLogin={() => setShowSignup(false)}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              switchToSignup={() => setShowSignup(true)}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Navbar
            userName={userName}
            userEmail={userEmail}
            profilePic={profilePic}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onLogout={handleLogout}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 2,
              overflowX: "hidden",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/quiz-list" element={<QuizList />} />
              <Route path="/take-quiz/:quizId" element={<TakeQuiz />} />
              <Route path="/add-quiz" element={<AddQuiz />} />
              <Route path="/ai-generator" element={<AIGenerator />} />
              <Route path="/ai-tools" element={<AIPoweredTools />} />
              <Route path="/ai-tools/summarizer" element={<AISummarizer />} />
              <Route path="/ai-tools/tutor" element={<AITutorChatbot />} />
              <Route
                path="/ai-tools/plagiarism"
                element={<PlagiarismChecker />}
              />
            </Routes>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
