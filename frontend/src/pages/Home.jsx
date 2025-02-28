import React, { useState } from "react";
import "../styles/Home.css";
import ShowProfile from "./showProfile";

function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/linkedInUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      
      const data = await response.json();
      console.log(data)
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-container">
      {profileData ? (
        <ShowProfile profileData={profileData} />
      ) : (
        <>
          <h2>Manage LinkedIn Portfolio</h2>
          <p>Enter your LinkedIn URL to fetch profile details:</p>
          <input
            type="text"
            placeholder="Enter LinkedIn URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={fetchProfile} disabled={loading}>
            {loading ? "Loading..." : "Fetch Profile"}
          </button>
          {loading && <p>Fetching profile data, please wait...</p>}
        </>
      )}
    </div>
  );
}

export default Home;