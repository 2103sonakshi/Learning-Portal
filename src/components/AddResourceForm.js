import React, { useState } from "react";
import axios from "axios";

const AddResourceForm = ({ onResourceAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/resources", {
        title,
        description,
        type,
        link,
      });
      setTitle("");
      setDescription("");
      setType("");
      setLink("");
      onResourceAdded();
    } catch (err) {
      console.error("Error adding resource", err);
    }
  };

  // Styling
  const styles = {
    wrapper: {
      maxWidth: "600px",
      margin: "40px auto",
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    label: {
      fontWeight: "bold",
      fontSize: "14px",
      color: "#333",
    },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "15px",
    },
    button: {
      backgroundColor: "#2e86de",
      color: "white",
      padding: "10px",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="title" style={styles.label}>
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Enter title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <label htmlFor="description" style={styles.label}>
          Description
        </label>
        <input
          type="text"
          id="description"
          placeholder="Short description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />

        <label htmlFor="type" style={styles.label}>
          Type
        </label>
        <input
          type="text"
          id="type"
          placeholder="e.g. PDF, Video, Notes"
          value={type}
          required
          onChange={(e) => setType(e.target.value)}
          style={styles.input}
        />

        <label htmlFor="link" style={styles.label}>
          Resource Link
        </label>
        <input
          type="url"
          id="link"
          placeholder="https://example.com"
          value={link}
          required
          onChange={(e) => setLink(e.target.value)}
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1b4f9c")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2e86de")}
        >
          ➕ Add Resource
        </button>
      </form>
    </div>
  );
};

export default AddResourceForm;
