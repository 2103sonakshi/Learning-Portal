import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import "./Dashboard.css";

const ResourceCard = ({ resource, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case "link":
        return "🔗";
      case "pdf":
      case "docx":
        return "📄";
      case "video":
        return "▶️";
      case "other":
        return "📦";
      default:
        return "📚";
    }
  };

  return (
    <Card
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      className="card"
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ mb: 1, fontSize: 32, fontWeight: "bold" }}
        >
          {getIcon(resource.type)}
        </Typography>
        <Typography gutterBottom variant="h6" component="h2">
          {resource.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resource.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ mt: "auto" }}>
        {resource.link && (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button size="small">Open Resource</Button>
          </a>
        )}
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(resource._id)}
        >
          🗑️ Delete
        </Button>
      </CardActions>
    </Card>
  );
};

function Dashboard() {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "",
    link: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  const fetchResources = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/resources");
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources", error);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/resources", newResource);
      setNewResource({ title: "", description: "", type: "", link: "" });
      fetchResources();
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error adding resource:", err);
    }
  };

  const handleDelete = (id) => {
    setResourceToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/resources/${resourceToDelete}`
      );
      setResources(resources.filter((res) => res._id !== resourceToDelete));
      setDialogOpen(false);
      setResourceToDelete(null);
    } catch (error) {
      console.error("Error deleting resource", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const filteredResources = resources.filter((res) =>
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, pt: 2, pb: 2 }}
      className={`dashboard-container ${darkMode ? "dark" : ""}`}
    >
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
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Link to="/add-quiz" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2196f3",
                "&:hover": {
                  backgroundColor: "#1976d2",
                },
              }}
            >
              ➕ Create Quiz
            </Button>
          </Link>
          <Link to="/quiz-list" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: darkMode ? "#4caf50" : "#2196f3",
                "&:hover": {
                  backgroundColor: darkMode ? "#43a047" : "#1976d2",
                },
              }}
            >
              📝 Quizzes
            </Button>
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mt: { xs: 2, md: 0 },
          }}
        >
          <Link to="/ai-tools" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: darkMode ? "#ff9800" : "#f57c00",
                "&:hover": {
                  backgroundColor: darkMode ? "#f57c00" : "#f57c00",
                },
              }}
            >
              ✨ AI-Powered Tools
            </Button>
          </Link>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleAddResource} sx={{ mb: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Add Study Resource
        </Typography>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={newResource.title}
              onChange={(e) =>
                setNewResource({
                  ...newResource,
                  title: e.target.value,
                })
              }
              required
              aria-label="Resource Title"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                id="type-select"
                label="Type"
                value={newResource.type}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    type: e.target.value,
                  })
                }
                required
              >
                <MenuItem value="">
                  <em>Type</em>
                </MenuItem>
                <MenuItem value="link">Link</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={newResource.description}
              onChange={(e) =>
                setNewResource({
                  ...newResource,
                  description: e.target.value,
                })
              }
              aria-label="Resource Description"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Resource Link (URL)"
              variant="outlined"
              type="url"
              value={newResource.link}
              onChange={(e) =>
                setNewResource({
                  ...newResource,
                  link: e.target.value,
                })
              }
              aria-label="Resource Link"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<span>➕</span>}
            >
              Add Resource
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search Resources"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔍</InputAdornment>
            ),
          }}
        />
      </Box>

      <Typography variant="h5" component="h3" gutterBottom>
        Study Resources
      </Typography>
      {filteredResources.length === 0 ? (
        <p>No resources found matching "{searchTerm}".</p>
      ) : (
        <Grid container spacing={4}>
          {filteredResources.map((res) => (
            <Grid item xs={12} sm={6} md={4} key={res._id}>
              <ResourceCard resource={res} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Resource added successfully!
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this resource? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;
