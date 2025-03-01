import React, { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccessMessage("");
      return;
    }

    setError(""); // Clear error if validation passes

    try {
      const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.text(); // Spring Boot returns plain text response

      if (response.ok) {
        setSuccessMessage(data);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        navigate("/")
      } else {
        setError(data);
        setSuccessMessage("");
      }
    } catch (error) {
      setError("Failed to register. Please try again later.");
      setSuccessMessage("");
      console.log(`Error: ${error}`)
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;