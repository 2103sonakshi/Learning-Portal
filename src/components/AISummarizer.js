import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  Alert,
} from "@mui/material";

const AISummarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // The API key is embedded directly for simplicity.
  const API_KEY = "AIzaSyC_DeoopqwnhkcNu6lkYIbN3bHMOgPmIDk";

  // Function to call the Gemini API to get a summary
  const getSummary = async () => {
    setLoading(true);
    setSummary("");
    setError(null);

    const prompt = `Summarize the following text in a concise and clear manner:\n\n${text}`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        const generatedText = result.candidates[0].content.parts[0].text;
        setSummary(generatedText);
      } else {
        setError("Failed to generate summary. Please try again.");
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
        Text Summarizer 📄
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Paste your text below to get a concise summary in seconds.
      </Typography>

      <Card
        sx={{
          width: "100%",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e293b" : "#f8f9fa",
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            label="Paste your text here..."
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={getSummary}
            disabled={!text || loading}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              backgroundColor:
                theme.palette.mode === "dark" ? "#ff9800" : "#f57c00",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#f57c00" : "#e65100",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Summarize"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mt: 4, width: "100%" }}>
          <Typography fontWeight="bold">Error:</Typography>
          <Typography>{error}</Typography>
        </Alert>
      )}

      {summary && (
        <Card
          sx={{
            mt: 4,
            width: "100%",
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor:
              theme.palette.mode === "dark" ? "#1e293b" : "#f8f9fa",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Summary:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {summary}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AISummarizer;
