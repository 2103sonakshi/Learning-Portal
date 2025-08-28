import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";

const QuizPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "8px",
  boxShadow: theme.shadows[3],
  height: "100%",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
  transition: theme.transitions.create(["background-color", "box-shadow"]),
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
    boxShadow: theme.shadows[6],
  },
}));

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/quizzes/${id}`);
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
        alert("Quiz deleted successfully!");
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert(`Failed to delete quiz. Error: ${error.message}`);
      }
    }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Available Quizzes
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/add-quiz"
            variant="contained"
            color="primary"
          >
            ➕ Add New Quiz
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            color="secondary"
          >
            ⬅ Back to Dashboard
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {quizzes.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          No quizzes available. Please add a new quiz.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz._id}>
              <QuizPaper onClick={() => navigate(`/take-quiz/${quiz._id}`)}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {quiz.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {quiz.questions.length} Questions
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: "auto",
                    pt: 2,
                  }}
                >
                  <Button
                    component={Link}
                    to={`/take-quiz/${quiz._id}`}
                    variant="contained"
                    color="primary"
                  >
                    Take Quiz
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(quiz._id);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </QuizPaper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default QuizList;
