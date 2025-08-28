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
  Alert,
  List,
  ListItem,
  useTheme,
} from "@mui/material";

const PlagiarismChecker = () => {
  const [myText, setMyText] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  // The API key is embedded directly for simplicity.
  // In a real application, you would use environment variables.
  const API_KEY = "AIzaSyC_DeoopqwnhkcNu6lkYIbN3bHMOgPmIDk";

  // Function to check for plagiarism using the Gemini API
  const checkPlagiarism = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    // The prompt asks the model to act as a plagiarism checker and provide a structured JSON response.
    const prompt = `You are a plagiarism detection tool. Compare the following two texts and provide a plagiarism report. Your response should be a JSON object containing:
      1. 'score': A number from 0 to 100 representing the percentage of similarity.
      2. 'similarSentences': An array of strings, where each string is a sentence from "My Text" that is similar to a sentence in "Source Text". If no similarity is found, this array should be empty.
      
      My Text: "${myText}"
      Source Text: "${sourceText}"
    `;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            score: { type: "NUMBER" },
            similarSentences: {
              type: "ARRAY",
              items: { type: "STRING" },
            },
          },
          propertyOrdering: ["score", "similarSentences"],
        },
      },
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
        const jsonString = result.candidates[0].content.parts[0].text;
        const parsedResult = JSON.parse(jsonString);
        setResult(parsedResult);
      } else {
        setError("Failed to check for plagiarism. Please try again.");
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
        Plagiarism Checker 🕵️
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Compare your text against a source to check for similarities.
      </Typography>

      <Box sx={{ width: "100%", mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Paste your text here..."
          variant="outlined"
          value={myText}
          onChange={(e) => setMyText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Paste the source text to compare against..."
          variant="outlined"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
        />
      </Box>

      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "center", mb: 4 }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={checkPlagiarism}
          disabled={!myText || !sourceText || loading}
          sx={{
            py: 2,
            px: 6,
            fontSize: "1.25rem",
            fontWeight: "bold",
            borderRadius: 2,
            backgroundColor:
              theme.palette.mode === "dark" ? "#ab47bc" : "#8e24aa",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#9c27b0" : "#7b1fa2",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Check Plagiarism"
          )}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          <Typography fontWeight="bold">Error:</Typography>
          <Typography>{error}</Typography>
        </Alert>
      )}

      {result && (
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
              Plagiarism Report:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Similarity Score:{" "}
              <Typography
                component="span"
                sx={{
                  fontWeight: "bold",
                  color:
                    result.score > 50
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                }}
              >
                {result.score}%
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {result.score > 50
                ? "High similarity detected. Consider rewriting."
                : "Low similarity detected. Good to go!"}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Similar Sentences:
            </Typography>
            {result.similarSentences.length > 0 ? (
              <List sx={{ pl: 2 }}>
                {result.similarSentences.map((sentence, index) => (
                  <ListItem key={index} sx={{ display: "list-item", py: 0.5 }}>
                    <Typography>{sentence}</Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No significant similar sentences found.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default PlagiarismChecker;
