import React, { useState } from "react";
import axios from "axios";
import SERVER_URL from "../constant";

const ResourceList = ({ resources, onResourceDeleted }) => {
  const [confirmId, setConfirmId] = useState(null);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${SERVER_URL}/api/resources/{confirmId}`);
      onResourceDeleted();
      setConfirmId(null);
    } catch (err) {
      console.error("Error deleting resource", err);
      setConfirmId(null);
    }
  };

  // Define CSS styles as JS objects for cleaner reuse
  const styles = {
    wrapper: {
      padding: "20px",
      maxWidth: "1000px",
      margin: "auto",
    },
    heading: {
      fontSize: "24px",
      marginBottom: "20px",
      textAlign: "center",
      color: "#2e86de",
    },
    list: {
      listStyle: "none",
      padding: 0,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "16px 20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
      transition: "transform 0.2s ease, box-shadow 0.3s ease",
    },
    titleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "600",
      marginBottom: "8px",
    },
    typeText: {
      fontSize: "14px",
      color: "#888",
    },
    description: {
      fontSize: "15px",
      marginBottom: "15px",
      color: "#444",
    },
    buttons: {
      display: "flex",
      gap: "10px",
    },
    openBtn: {
      backgroundColor: "#27ae60",
      color: "#fff",
      padding: "6px 10px",
      borderRadius: "5px",
      textDecoration: "none",
      fontSize: "14px",
    },
    deleteBtn: {
      backgroundColor: "#e74c3c",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
    },
    confirmOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    confirmBox: {
      backgroundColor: "#fff",
      padding: "25px",
      borderRadius: "10px",
      textAlign: "center",
      width: "320px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    },
    confirmActions: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      gap: "15px",
    },
    confirmYes: {
      backgroundColor: "#e74c3c",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    confirmCancel: {
      backgroundColor: "gray",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>📚 Study Resources</h3>

      {resources.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>
          No resources added yet.
        </p>
      ) : (
        <ul style={styles.list}>
          {resources.map((resource) => (
            <li
              key={resource._id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 10px rgba(0, 0, 0, 0.08)";
              }}
            >
              <div style={styles.titleRow}>
                <span style={{ fontSize: "18px", color: "#333" }}>
                  {resource.title}
                </span>
                <span style={styles.typeText}>({resource.type})</span>
              </div>
              <div style={styles.description}>{resource.description}</div>
              <div style={styles.buttons}>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.openBtn}
                >
                  🔗 Open
                </a>
                <button
                  onClick={() => setConfirmId(resource._id)}
                  style={styles.deleteBtn}
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {confirmId && (
        <div style={styles.confirmOverlay}>
          <div style={styles.confirmBox}>
            <p>Are you sure you want to delete this resource?</p>
            <div style={styles.confirmActions}>
              <button onClick={confirmDelete} style={styles.confirmYes}>
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmId(null)}
                style={styles.confirmCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
