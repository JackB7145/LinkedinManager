// pages/Login.js
import React from "react";
import "../styles/Login.css";

function Login() {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;