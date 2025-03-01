import React, { useContext, useState, useEffect } from "react";
import "../styles/Home.css";
import ShowProfile from "./showProfile";
import ProfileList from "./ProfileList"; // Import ProfileList
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { isLogin, username, setUser, setIsLogin } = useContext(AuthContext);
  const [hasSavedProfiles, setHasSavedProfiles] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
        setUser(user);
        setIsLogin(true)
        console.log("Username found in localStorage:", user);
      } else {
        console.log("No username found in localStorage");
    }
    if (isLogin) {
      checkSavedProfiles();
    }
  }, []);

  const checkSavedProfiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8081/profiles/getProfiles", {
        method: "POST", // Ensure it's a POST request to send a body
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }), // Include username in the request body
      });

      if (!response.ok) throw new Error("Failed to fetch profiles");

      // const data = await response.json();

      setHasSavedProfiles(true);
    } catch (error) {
      console.error("Error fetching saved profiles:", error);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/linkedInUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("username"); // Remove from localStorage
    setUser(null);  // Update context state
    setIsLogin(false); // Update auth state
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="home-container">
      {/* Top Navbar */}
      <div className="navbar">
        <div className="auth-buttons">
          {isLogin ? (
            <>
              <div>
                <p className="welcome-message">Welcome Back!</p>
              </div>
              <div>
                <button className="login-btn" onClick={() => navigate("/login")}>
                  Change Profile
                </button>
              </div>
              <div>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <button className="login-btn" onClick={() => navigate("/login")}>
                  Login
                </button>
              </div>
              <div>
                <button className="signup-btn" onClick={() => navigate("/register")}>
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="portfolio-container">
        {profileData ? (
          <ShowProfile profileData={profileData} profileHide={() => setProfileData("")} />
        ) : (
          <>
            <h2>Manage LinkedIn Portfolios</h2>
            <p>Enter your LinkedIn URL to fetch profile details:</p>
            <input
              type="text"
              placeholder="Enter LinkedIn URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="fetch-profile-btn" onClick={fetchProfile} disabled={loading}>
              {loading ? "Loading..." : "Find Profile"}
            </button>
            {loading && <p>Fetching profile data, please wait...</p>}
          </>
        )}
      </div>

      {/* Saved Profiles Section */}
      {isLogin && (
        <div className="saved-profiles-container">
          <h3>Saved Profiles</h3>
          {hasSavedProfiles ? <ProfileList /> : <p>No saved profiles yet.</p>}
        </div>
      )}
    </div>
  );
}

export default Home;