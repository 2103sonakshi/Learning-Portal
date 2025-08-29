import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Input,
  DialogActions,
  Divider,
} from "@mui/material";

function Navbar({
  userName,
  userEmail,
  profilePic,
  darkMode,
  setDarkMode,
  onLogout,
  onSaveName,
  onSavePassword,
  onSavePhone,
  onSaveProfilePicture,
}) {
  const navigate = useNavigate();

  // Dialog state
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmRemovePhotoOpen, setConfirmRemovePhotoOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'editName', 'changePassword', etc.

  // Profile data states
  const [displayedName, setDisplayedName] = useState(userName || "");
  const [displayedProfilePic, setDisplayedProfilePic] = useState(
    profilePic || ""
  );

  // Form input states
  const [newName, setNewName] = useState(userName || "");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newProfilePicFile, setNewProfilePicFile] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);

  // Snackbar states for all notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    setDisplayedName(userName || "");
    setNewName(userName || "");
  }, [userName]);

  useEffect(() => {
    setDisplayedProfilePic(profilePic || "");
  }, [profilePic]);

  // Dark mode effect
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    if (setDarkMode) setDarkMode(storedDarkMode);
  }, [setDarkMode]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  // --- Handlers for opening/closing dialogs ---
  const handleProfileClick = () => {
    setProfileDialogOpen(true);
    setActionType(null); // Reset action view
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
    setNewName(userName || "");
    setNewPassword("");
    setNewPhone("");
    setNewProfilePicFile(null);
    setPreviewPic(null);
    setActionType(null); // Reset action view
  };

  const handleActionClick = (type) => {
    setActionType(type);
  };

  // --- Confirmation Handlers ---
  const handleLogoutConfirmation = () => {
    setConfirmLogoutOpen(true);
  };

  const handleCloseLogoutConfirmation = () => {
    setConfirmLogoutOpen(false);
  };

  const handleDeleteConfirmation = () => {
    setConfirmDeleteOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
  };

  const handleRemovePhotoConfirmation = () => {
    setConfirmRemovePhotoOpen(true);
  };

  const handleCloseRemovePhotoConfirmation = () => {
    setConfirmRemovePhotoOpen(false);
  };

  // --- Notification functions ---
  const showNotification = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // --- API and Business Logic Functions ---
  const getAuthHeader = () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const saveName = async () => {
    const trimmed = (newName || "").trim();
    if (!trimmed) {
      showNotification("Please enter a valid name.", "error");
      return;
    }
    try {
      const payload = { email: userEmail, name: trimmed };
      const response = await axios.post(
        "http://localhost:${SERVER_URL}/api/user/update-name",
        payload,
        { headers: { ...getAuthHeader() } }
      );
      const updatedName = response.data?.name || trimmed;
      setDisplayedName(updatedName);
      setNewName(updatedName);
      localStorage.setItem("userName", updatedName);
      if (typeof onSaveName === "function") {
        try {
          onSaveName(updatedName);
        } catch (err) {
          console.warn("onSaveName callback error:", err);
        }
      }
      showNotification("Name updated successfully!", "success");
      setActionType(null);
    } catch (err) {
      console.error("Error updating name:", err);
      showNotification(
        err.response?.data?.message || "Failed to update name.",
        "error"
      );
    }
  };

  const savePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showNotification("Password must be at least 6 characters.", "error");
      return;
    }
    try {
      const payload = { email: userEmail, newPassword };
      await axios.post(
        "http://localhost:${SERVER_URL}/api/user/change-password",
        payload,
        { headers: { ...getAuthHeader() } }
      );
      if (typeof onSavePassword === "function") {
        try {
          onSavePassword();
        } catch (err) {
          console.warn("onSavePassword callback error:", err);
        }
      }
      setNewPassword("");
      showNotification("Password changed successfully!", "success");
      setActionType(null);
    } catch (err) {
      console.error("Error changing password:", err);
      showNotification(
        err.response?.data?.message || "Failed to change password.",
        "error"
      );
    }
  };

  const savePhone = async () => {
    const trimmed = (newPhone || "").trim();
    if (!trimmed) {
      showNotification("Please enter a phone number.", "error");
      return;
    }
    try {
      const payload = { email: userEmail, phone: trimmed };
      const response = await axios.post(
        "http://localhost:${SERVER_URL}/api/user/update-phone",
        payload,
        { headers: { ...getAuthHeader() } }
      );
      if (typeof onSavePhone === "function") {
        try {
          onSavePhone(trimmed);
        } catch (err) {
          console.warn("onSavePhone callback error:", err);
        }
      }
      showNotification("Phone updated!", "success");
      setActionType(null);
    } catch (err) {
      console.error("Error updating phone:", err);
      showNotification(
        err.response?.data?.message || "Failed to update phone.",
        "error"
      );
    }
  };

  const handlePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfilePicFile(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const saveProfilePicture = async () => {
    if (!newProfilePicFile) {
      showNotification("Please select an image first!", "error");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("email", userEmail);
      formData.append("profilePic", newProfilePicFile);
      const response = await axios.post(
        "http://localhost:${SERVER_URL}/api/user/update-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeader(),
          },
        }
      );
      const newUrl = response.data?.profilePicUrl || "";
      if (newUrl) {
        setDisplayedProfilePic(newUrl);
        localStorage.setItem("profilePic", newUrl);
        if (typeof onSaveProfilePicture === "function") {
          try {
            onSaveProfilePicture(newUrl);
          } catch (err) {
            console.warn("onSaveProfilePicture callback error:", err);
          }
        }
        showNotification("Profile picture updated successfully!", "success");
      } else {
        showNotification(
          "Profile picture updated but server did not return the new URL.",
          "warning"
        );
      }
      setNewProfilePicFile(null);
      setPreviewPic(null);
      setActionType(null);
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      showNotification(
        err.response?.data?.message || "Failed to upload profile picture.",
        "error"
      );
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const payload = { email: userEmail };
      const headers = getAuthHeader();
      await axios.post(
        "http://localhost:${SERVER_URL}/api/user/remove-profile-pic",
        payload,
        { headers }
      );
      setDisplayedProfilePic("");
      localStorage.removeItem("profilePic");
      showNotification("Profile photo removed successfully!", "success");
      setActionType(null);
      handleCloseRemovePhotoConfirmation();
    } catch (err) {
      console.error("Error removing profile photo:", err);
      showNotification(
        err.response?.data?.message ||
          "Failed to remove profile photo. Please check your network or try again later.",
        "error"
      );
      handleCloseRemovePhotoConfirmation();
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.post(
        "http://localhost:${SERVER_URL}/api/user/delete-account",
        { email: userEmail },
        { headers: { ...getAuthHeader() } }
      );
      handleLogout();
      showNotification("Account deleted successfully.", "success");
    } catch (err) {
      console.error("Error deleting account:", err);
      showNotification(
        err.response?.data?.message || "Failed to delete account.",
        "error"
      );
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.setItem("isLoggedIn", "false");
    sessionStorage.clear();
    localStorage.removeItem("darkMode");
    showNotification("Logged out successfully!", "success");
    navigate("/login", { replace: true });
  };

  // I removed the old inline style and replaced it with a responsive sx prop.
  const renderDialogContent = () => {
    if (actionType === "editName") {
      return (
        <Box sx={{ width: "100%", mt: 2 }}>
          <TextField
            fullWidth
            label="New Name"
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            onClick={saveName}
            variant="contained"
            color="primary"
            fullWidth
          >
            Save Name
          </Button>
          <Button onClick={() => setActionType(null)} sx={{ mt: 1 }} fullWidth>
            Cancel
          </Button>
        </Box>
      );
    }
    if (actionType === "changePassword") {
      return (
        <Box sx={{ width: "100%", mt: 2 }}>
          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            onClick={savePassword}
            variant="contained"
            color="primary"
            fullWidth
          >
            Change Password
          </Button>
          <Button onClick={() => setActionType(null)} sx={{ mt: 1 }} fullWidth>
            Cancel
          </Button>
        </Box>
      );
    }
    if (actionType === "updatePhone") {
      return (
        <Box sx={{ width: "100%", mt: 2 }}>
          <TextField
            fullWidth
            label="New Phone Number"
            variant="outlined"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            onClick={savePhone}
            variant="contained"
            color="primary"
            fullWidth
          >
            Save Phone
          </Button>
          <Button onClick={() => setActionType(null)} sx={{ mt: 1 }} fullWidth>
            Cancel
          </Button>
        </Box>
      );
    }
    if (actionType === "updatePic") {
      return (
        <Box sx={{ width: "100%", mt: 2, textAlign: "center" }}>
          <Input type="file" onChange={handlePicChange} sx={{ mb: 2 }} />
          {previewPic && (
            <Avatar
              src={previewPic}
              sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
            />
          )}
          <Button
            onClick={saveProfilePicture}
            variant="contained"
            color="primary"
            fullWidth
          >
            Save Photo
          </Button>
          <Button onClick={() => setActionType(null)} sx={{ mt: 1 }} fullWidth>
            Cancel
          </Button>
        </Box>
      );
    }

    // Default view
    return (
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
            position: "relative",
          }}
        >
          <Avatar
            src={displayedProfilePic}
            alt={displayedName}
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          <Button
            onClick={handleRemovePhotoConfirmation}
            size="small"
            color="error"
            sx={{ mt: 1 }}
          >
            Remove Photo
          </Button>
          <Button
            onClick={() => handleActionClick("updatePic")}
            size="small"
            sx={{ mt: 1, textTransform: "none" }}
          >
            Update Profile Picture
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 0 }}>
            {displayedName || "User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userEmail || "No email provided"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button onClick={() => handleActionClick("editName")} fullWidth>
            ✏️ Update Name
          </Button>
          <Button onClick={() => handleActionClick("changePassword")} fullWidth>
            🔑 Change Password
          </Button>
          <Button onClick={() => handleActionClick("updatePhone")} fullWidth>
            📞 Update Phone
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box
        component="nav"
        sx={{
          bgcolor: darkMode ? "#1e1e1e" : "#2196f3",
          color: "#fff",
          p: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          height: "60px",
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconButton
            onClick={handleProfileClick}
            sx={{ width: 40, height: 40, cursor: "pointer" }}
          >
            <Avatar
              src={displayedProfilePic}
              alt={displayedName}
              sx={{ width: 40, height: 40 }}
            />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#fff",
              display: { xs: "none", sm: "block" },
            }}
          >
            👋 Welcome, {displayedName || "User"}
          </Typography>
        </Box>
        <Box
          sx={{
            position: { xs: "static", sm: "absolute" },
            left: { sm: "50%" },
            top: { sm: "50%" },
            transform: { sm: "translate(-50%, -50%)" },
            textAlign: { xs: "right", sm: "center" },
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              margin: 0,
              fontSize: { xs: "18px", sm: "22px" },
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Learning Portal
          </Typography>
        </Box>
        <Box></Box>
      </Box>
      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Profile
          <IconButton
            aria-label="close"
            onClick={handleCloseProfileDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>✖</span>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{renderDialogContent()}</DialogContent>
        <DialogActions
          sx={{ flexDirection: "column", alignItems: "center", p: 2 }}
        >
          <Button onClick={() => setDarkMode(!darkMode)} fullWidth>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </Button>
          <Button onClick={handleLogoutConfirmation} fullWidth>
            🚪 Logout
          </Button>
          <Button onClick={handleDeleteConfirmation} color="error" fullWidth>
            ⛔ Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={confirmLogoutOpen} onClose={handleCloseLogoutConfirmation}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* NEW: Remove Photo Confirmation Dialog */}
      <Dialog
        open={confirmRemovePhotoOpen}
        onClose={handleCloseRemovePhotoConfirmation}
      >
        <DialogTitle>Confirm Photo Removal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove your profile photo?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemovePhotoConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemovePhoto} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
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
    </>
  );
}

export default Navbar;
