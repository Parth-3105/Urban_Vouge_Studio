import React, { useState } from "react";

const ChangeNameModal = ({ isOpen, onClose, onSubmit }) => {
  const [newName, setNewName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newName);
    setNewName("");
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Change Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={inputStyle}
          />
          <div style={{ marginTop: "10px" }}>
            <button type="submit" style={buttonStyle}>
              Save
            </button>
            <button onClick={onClose} style={{ ...buttonStyle, backgroundColor: "gray" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
};

const buttonStyle = {
  padding: "10px",
  width: "45%",
  margin: "5px",
  border: "none",
  color: "white",
  backgroundColor: "black",
  cursor: "pointer",
};

export default ChangeNameModal;
