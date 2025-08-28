import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
  useTheme,
  Alert,
} from "@mui/material";

const AITutorChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // The API key is embedded directly for simplicity.
  const API_KEY = "AIzaSyC_DeoopqwnhkcNu6lkYIbN3bHMOgPmIDk";

  // Scroll to the bottom of the chat window when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to send a message to the AI and get a response
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    // Prepare the chat history for the API call
    const chatHistory = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));
    chatHistory.push({
      role: "user",
      parts: [
        {
          text: `You are an AI tutor. Provide a clear and helpful explanation for the following question: ${input}`,
        },
      ],
    });

    const payload = {
      contents: chatHistory,
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const aiMessageText = result.candidates[0].content.parts[0].text;
        const aiMessage = { text: aiMessageText, sender: "ai" };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        setError("Failed to get a response. Please try again.");
      }
    } catch (e) {
      setError(
        "An unexpected error occurred. Please check your network and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        pb: 4,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", textAlign: "left", mb: 4 }}>
        <Button
          component={Link}
          to="/ai-tools"
          startIcon={<span>&larr;</span>}
          sx={{
            textDecoration: "none",
            color: theme.palette.text.secondary,
          }}
        >
          Go Back to AI Tools
        </Button>
      </Box>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
      >
        AI Tutor Chatbot 🤖
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Ask any question, and I'll do my best to explain it.
      </Typography>

      <Paper
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          width: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e293b" : "#f8f9fa",
          overflowY: "auto",
          mb: 2,
          "&::-webkit-scrollbar": { display: "none" },
          MsOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {messages.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: theme.palette.text.disabled,
              textAlign: "center",
            }}
          >
            Start a conversation!
          </Box>
        )}
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                maxWidth: "80%",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                backgroundColor:
                  message.sender === "user"
                    ? theme.palette.primary.main
                    : theme.palette.action.selected,
                color:
                  message.sender === "user"
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                borderBottomLeftRadius: message.sender === "user" ? 16 : 0,
                borderBottomRightRadius: message.sender === "user" ? 0 : 16,
              }}
            >
              <Typography>{message.text}</Typography>
            </Box>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.action.selected,
              }}
            >
              <CircularProgress size={20} />
            </Box>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          <Typography fontWeight="bold">Error:</Typography>
          <Typography>{error}</Typography>
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={sendMessage}
        sx={{ width: "100%", display: "flex", gap: 1 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask me a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!input.trim() || loading}
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: "bold",
            backgroundColor:
              theme.palette.mode === "dark" ? "#ff9800" : "#f57c00",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#f57c00" : "#e65100",
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default AITutorChatbot;
