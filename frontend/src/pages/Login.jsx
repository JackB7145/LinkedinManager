import React, { useState, useContext } from "react";
import "../styles/Login.css";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { AuthContext } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setIsLogin, setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.text(); // Spring Boot returns a plain text response

      if (response.ok) {
        setSuccessMessage(data);
        setUsername("");
        setPassword("");
        setIsLogin(true);
        setUser(username);
        localStorage.setItem("username", username);
        navigate("/");
      } else {
        setError(data);
      }
    } catch (error) {
      setError("Failed to log in. Please try again later.");
      console.log(`Error: ${error}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit">Login</button>
      </form>
      <p className="register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;