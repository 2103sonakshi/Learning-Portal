import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Alert,
} from "@mui/material";

function TakeQuiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:${SERVER_URL}/api/quizzes/${quizId}`
        );
        setQuiz(res.data);
        // Reset answers and score when a new quiz is loaded
        setAnswers({});
        setScore(null);
      } catch (err) {
        console.error("Failed to load quiz", err);
        setError("Failed to load quiz. Please check the URL and try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();

    const storedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedMode);
  }, [quizId]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  const handleSelect = (questionIndex, event) => {
    setAnswers({ ...answers, [questionIndex]: event.target.value });
  };

  const handleSubmit = () => {
    // Ensure all questions are answered before submitting
    const allAnswered = quiz.questions.every(
      (q, index) => answers[index] !== undefined
    );

    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let total = 0;
    quiz.questions.forEach((q, index) => {
      // Add a safety check to ensure both answers[index] and q.correctAnswer are not undefined
      // Also check if they are strings before calling trim()
      if (
        answers[index] &&
        typeof answers[index] === "string" &&
        q.correctAnswer &&
        typeof q.correctAnswer === "string"
      ) {
        if (
          answers[index].trim().toLowerCase() ===
          q.correctAnswer.trim().toLowerCase()
        ) {
          total++;
        }
      }
    });
    setScore(total);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!quiz) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Typography variant="h6">Quiz not found.</Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      className={darkMode ? "dark-mode" : ""}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: darkMode ? "#1e1e1e" : "#fff",
          color: darkMode ? "#f1f1f1" : "#333",
        }}
      >
        <Button
          onClick={() => navigate("/quiz-list")}
          variant="contained"
          sx={{ mb: 4, backgroundColor: "#2196f3", color: "#fff" }}
        >
          ⬅ Back to Quizzes
        </Button>

        <Typography variant="h4" component="h2" gutterBottom>
          {quiz.title}
        </Typography>

        {quiz.questions.map((q, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: darkMode ? "#2a2a2a" : "#f0f0f0",
              color: darkMode ? "#f1f1f1" : "#333",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Q{index + 1}: {q.questionText}
            </Typography>
            <RadioGroup
              aria-label={`question-${index}`}
              name={`question-${index}`}
              value={answers[index] || ""}
              onChange={(e) => handleSelect(index, e)}
            >
              {q.options.map((option, i) => (
                <FormControlLabel
                  key={i}
                  value={option}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: darkMode ? "#ffffff" : "#000000",
                        "&.Mui-checked": {
                          color: darkMode ? "#4caf50" : "#2196f3",
                        },
                      }}
                    />
                  }
                  label={option}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: darkMode ? "#f1f1f1" : "#333",
                    },
                    color: darkMode ? "#f1f1f1" : "#333",
                  }}
                />
              ))}
            </RadioGroup>
          </Paper>
        ))}

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: "#4caf50", color: "#fff" }}
        >
          Submit Quiz
        </Button>

        {score !== null && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="h6">
              Your Score: {score} / {quiz.questions.length}
            </Typography>
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default TakeQuiz;
