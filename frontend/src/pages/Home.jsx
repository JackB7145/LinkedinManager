//Importing dependencies
import React, { useContext, useState, useEffect } from "react";
import "../styles/Home.css";
import ShowProfile from "./showProfile";
import ProfileList from "./ProfileList"; // Import ProfileList
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

//Home Content
function Home() {

  //Initialzing fields used within this page
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { isLogin, username, setUser, setIsLogin } = useContext(AuthContext);
  const [hasSavedProfiles, setHasSavedProfiles] = useState(false);

  //Use effect called on page mount
  useEffect(() => {
    const user = localStorage.getItem("username"); //Gets the user from the local storage
    if (user) { //If the user is indeed, logged in this will trigger refreshing the app for corresponding content
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

  //Method used for getting saved profiles on page mount. Sends the username to the springboot backend and recieves back a json object containing all of the saved portfolios
  const checkSavedProfiles = async () => {
    try {

      //Fetching the api content
      const response = await fetch("http://127.0.0.1:8081/profiles/getProfiles", {
        method: "POST", // Ensure it's a POST request to send a body
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }), // Include username in the request body
      });

      if (!response.ok) throw new Error("Failed to fetch profiles");

      setHasSavedProfiles(true);
    } catch (error) {
      console.error("Error fetching saved profiles:", error);
    }
  };

  //This method is used for retrieving the initial profile from the python service in my python api
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }), //Provides the url of the candidate in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json(); //Converts the response to json
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

  //Returning content for home page
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