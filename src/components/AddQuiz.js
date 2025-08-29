import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../constant";

const AddQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = event.target.value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${SERVER_URL}/api/quizzes`, {
        title,
        questions,
      });
      alert("Quiz created successfully!");
      navigate("/quiz-list");
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Create New Quiz 📝
        </Typography>
        <Button
          component={Link}
          to="/quiz-list"
          variant="outlined"
          color="primary"
        >
          Back to Quizzes
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Quiz Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        {questions.map((q, qIndex) => (
          <Paper
            key={qIndex}
            sx={{ mb: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Question {qIndex + 1}</Typography>
              {questions.length > 1 && (
                <IconButton
                  onClick={() => removeQuestion(qIndex)}
                  color="error"
                >
                  🗑️
                </IconButton>
              )}
            </Box>
            <TextField
              fullWidth
              label="Question Text"
              variant="outlined"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              required
              sx={{ mb: 2 }}
            />
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">Options</FormLabel>
              <RadioGroup
                aria-label="correct-answer"
                name={`correct-answer-${qIndex}`}
                value={q.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(qIndex, e)}
              >
                {q.options.map((option, oIndex) => (
                  <Box
                    key={oIndex}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <TextField
                      fullWidth
                      label={`Option ${String.fromCharCode(65 + oIndex)}`}
                      variant="outlined"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                      required
                    />
                    <FormControlLabel
                      value={option}
                      control={<Radio />}
                      label="Correct"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        ))}

        <Button
          onClick={addQuestion}
          variant="outlined"
          color="secondary"
          sx={{ mb: 3 }}
          startIcon={<span>➕</span>}
        >
          Add Another Question
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Create Quiz
        </Button>
      </Box>
    </Container>
  );
};

export default AddQuiz;
