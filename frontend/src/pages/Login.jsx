//Importing dependencies
import React, { useState, useContext } from "react";
import "../styles/Login.css";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { AuthContext } from '../context/AuthContext';

//Login function used to show the login page
function Login() {

  //Initialzing fields used thrughout this page
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { setIsLogin, setUser } = useContext(AuthContext); //Global auth context

  //Submit method used when the submit button is pressed
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    //Sends an api call to verify credentials in the springboot back end
    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), //Provides the username and password
      });

      const data = await response.text(); // Spring Boot returns a plain text response

      if (response.ok) { 
        setSuccessMessage(data);
        setUsername(""); //Resetting the form
        setPassword(""); //Resetting the form
        setIsLogin(true); //Changing the logged in state to true
        setUser(username); //Setting the global auth context to the entered username
        localStorage.setItem("username", username); //Saving the username in localstorage to be used upon page refresh
        navigate("/");
      } else {
        setError(data);
      }
    } catch (error) {
      setError("Failed to log in. Please try again later.");
      console.log(`Error: ${error}`);
    }
  };

  //Displaying all content relevent to the login page
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