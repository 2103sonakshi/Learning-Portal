import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";

const AIGenerator = () => {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizReady, setQuizReady] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();
  const theme = useTheme();

  // The API key is embedded directly for simplicity.
  const API_KEY = "AIzaSyC_DeoopqwnhkcNu6lkYIbN3bHMOgPmIDk";

  // Function to generate the quiz by calling the Gemini API
  const generateQuiz = async (quizTopic, count) => {
    setLoading(true);
    setQuizData(null);
    setError(null);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizReady(false);

    const prompt = `Generate a ${count}-question multiple-choice quiz on the topic of "${quizTopic}". Provide a question, an array of 4 options, and the correct answer. The options should include the correct answer. Ensure the response is a JSON array of objects. The correct answer should be a string that exactly matches one of the options.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              question: { type: "STRING" },
              options: { type: "ARRAY", items: { type: "STRING" } },
              correctAnswer: { type: "STRING" },
            },
            propertyOrdering: ["question", "options", "correctAnswer"],
          },
        },
      },
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

    let retries = 0;
    const maxRetries = 5;
    const baseDelay = 1000;

    while (retries < maxRetries) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 429) {
          retries++;
          const delay = baseDelay * Math.pow(2, retries);
          console.log(
            `Rate limit exceeded. Retrying in ${delay / 1000} seconds...`
          );
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }

        const result = await response.json();
        const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (jsonString) {
          let parsedData;
          try {
            parsedData = JSON.parse(jsonString);
            if (!Array.isArray(parsedData) || parsedData.length === 0) {
              setError("The generated quiz data is not in the correct format.");
            } else {
              setQuizData(parsedData);
              setQuizReady(true);
            }
          } catch (jsonError) {
            setError("Failed to parse the quiz data. Please try again.");
          }
        } else {
          setError("Failed to generate quiz. Please try again.");
        }
        break;
      } catch (e) {
        setError("An unexpected error occurred. Please check your network.");
        break;
      } finally {
        setLoading(false);
      }
    }

    if (retries >= maxRetries) {
      setError("Maximum retries exceeded. Please try again later.");
      setLoading(false);
    }
  };

  const handleAnswerClick = (option) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(option);
      const isCorrect = option === quizData[currentQuestionIndex].correctAnswer;
      if (isCorrect) {
        setScore(score + 1);
        setSnackbarMessage("Correct Answer! 🎉");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(
          `Incorrect. The correct answer was: ${quizData[currentQuestionIndex].correctAnswer}`
        );
        setSnackbarSeverity("error");
      }
      setSnackbarOpen(true);
    }
  };

  const handleNextQuestion = () => {
    setSnackbarOpen(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleStartQuiz = () => {
    setQuizReady(false);
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setQuizReady(true);
  };

  const handleGenerateAnotherQuiz = () => {
    setQuizData(null);
    setTopic("");
    setQuestionCount(5);
    setError(null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const renderQuizContent = () => {
    if (quizCompleted) {
      return (
        <Box sx={{ textAlign: "center", animation: "fadeIn 0.5s" }}>
          <Typography variant="h4" gutterBottom>
            Quiz Complete! 🎉
          </Typography>
          <Typography variant="h5" sx={{ mb: 2 }}>
            You scored: {score} / {quizData.length}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={handleRetryQuiz}
              sx={{ py: 1.5, px: 4 }}
            >
              Retry Quiz
            </Button>
            <Button
              variant="outlined"
              onClick={handleGenerateAnotherQuiz}
              sx={{ py: 1.5, px: 4 }}
            >
              Generate Another
            </Button>
          </Box>
        </Box>
      );
    }

    const currentQuiz = quizData[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = quizData.length;

    return (
      <Box sx={{ width: "100%", animation: "fadeIn 0.5s" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="body1">
            Question {questionNumber} of {totalQuestions}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Score: {score}
          </Typography>
        </Box>
        <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {questionNumber}. {currentQuiz.question}
            </Typography>
            <RadioGroup
              value={selectedAnswer || ""}
              onChange={(e) => handleAnswerClick(e.target.value)}
            >
              {currentQuiz.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled={selectedAnswer !== null}
                  sx={{
                    my: 1,
                    p: 1.5,
                    border: "1px solid",
                    borderColor:
                      selectedAnswer === option
                        ? option === currentQuiz.correctAnswer
                          ? theme.palette.success.main
                          : theme.palette.error.main
                        : theme.palette.divider,
                    backgroundColor:
                      selectedAnswer === option
                        ? option === currentQuiz.correctAnswer
                          ? theme.palette.success.light
                          : theme.palette.error.light
                        : "transparent",
                    "&:hover": {
                      borderColor:
                        selectedAnswer === null
                          ? theme.palette.primary.main
                          : null,
                      cursor:
                        selectedAnswer === null ? "pointer" : "not-allowed",
                    },
                    borderRadius: 1,
                  }}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        {selectedAnswer !== null && (
          <Box sx={{ textAlign: "center", mt: 3, animation: "fadeIn 0.5s" }}>
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              sx={{ py: 1.5, px: 4 }}
            >
              {currentQuestionIndex < quizData.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const renderQuizReadyScreen = () => {
    return (
      <Box sx={{ textAlign: "center", animation: "fadeIn 0.5s" }}>
        <Typography variant="h4" gutterBottom>
          Quiz Generated!
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Topic:{" "}
          <Typography component="span" fontWeight="bold">
            {topic}
          </Typography>
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Questions:{" "}
          <Typography component="span" fontWeight="bold">
            {quizData.length}
          </Typography>
        </Typography>
        <Button
          variant="contained"
          onClick={handleStartQuiz}
          sx={{ py: 1.5, px: 4 }}
        >
          Start Quiz
        </Button>
      </Box>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 4, width: "100%" }}>
          <Typography fontWeight="bold">Error:</Typography>
          <Typography>{error}</Typography>
        </Alert>
      );
    }

    if (quizData) {
      return quizReady ? renderQuizReadyScreen() : renderQuizContent();
    }

    return (
      <Card sx={{ p: 3, width: "100%", borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Enter a quiz topic (e.g., 'The Solar System')"
            variant="outlined"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Number of questions (1-10)"
            type="number"
            variant="outlined"
            inputProps={{ min: 1, max: 10 }}
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => generateQuiz(topic, questionCount)}
            disabled={!topic || loading}
            sx={{ py: 1.5 }}
          >
            Generate Quiz
          </Button>
        </CardContent>
      </Card>
    );
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
        <Typography
          component={Link}
          to="/ai-tools"
          sx={{
            textDecoration: "none",
            color: theme.palette.text.secondary,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          &larr; Go Back to AI Tools
        </Typography>
      </Box>

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
      >
        AI Quiz Generator 📝
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Enter a topic and let our AI create a multiple-choice quiz for you!
      </Typography>

      {renderContent()}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AIGenerator;
