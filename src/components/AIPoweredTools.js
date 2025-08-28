import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  useTheme,
} from "@mui/material";

const AIToolCard = ({ title, description, emoji, path }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: 3,
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 6,
          },
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e293b" : "#f8f9fa",
          color: theme.palette.text.primary,
        }}
      >
        <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 4 }}>
          <Typography variant="h3" component="div" sx={{ mb: 2 }}>
            {emoji}
          </Typography>
          <Typography variant="h5" component="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Button
            component={Link}
            to={path}
            variant="contained"
            sx={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#ff9800" : "#f57c00",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#f57c00" : "#e65100",
              },
            }}
          >
            Open Tool
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

const AIPoweredTools = () => {
  const theme = useTheme();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode === "true") {
      setDarkMode(true);
    }
  }, []);

  const tools = [
    {
      name: "AI Quiz Generator",
      description: "Generate multiple-choice quizzes from any topic.",
      emoji: "📝",
      path: "/ai-generator",
    },
    {
      name: "Summarizer",
      description: "Condense long articles or documents into key points.",
      emoji: "📄",
      path: "/ai-tools/summarizer",
    },
    {
      name: "AI Tutor Chatbot",
      description: "Get instant answers and help with your studies.",
      emoji: "🤖",
      path: "/ai-tools/tutor",
    },
    {
      name: "Plagiarism Checker",
      description: "Scan your text for originality and check for plagiarism.",
      emoji: "🔍",
      path: "/ai-tools/plagiarism",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        pt: 2,
        pb: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Go back to Dashboard link */}
      <Box sx={{ width: "100%", textAlign: "left", mb: 4 }}>
        <Typography
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: theme.palette.text.secondary,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          &larr; Go Back to Dashboard
        </Typography>
      </Box>

      {/* Main heading and introduction */}
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "2.5rem", md: "3.5rem" },
          textAlign: "center",
          mb: 2,
        }}
      >
        ✨ AI-Powered Tools
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 6 }}
      >
        Explore our suite of tools to enhance your learning experience.
      </Typography>

      {/* Tools Grid Container */}
      <Grid container spacing={4} justifyContent="center">
        {tools.map((tool, index) => (
          <AIToolCard
            key={index}
            title={tool.name}
            description={tool.description}
            emoji={tool.emoji}
            path={tool.path}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default AIPoweredTools;
