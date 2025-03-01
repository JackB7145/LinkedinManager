import React, { useEffect, useState, useContext } from "react";
import "../styles/ProfileList.css";
import { AuthContext } from "../context/AuthContext";

function ProfileList() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { username, isLogin } = useContext(AuthContext);

  // Helper function to format time period
  const formatTimePeriod = (timePeriod) => {
    if (timePeriod && typeof timePeriod === "object") {
      const start = timePeriod.startDate ? `${timePeriod.startDate.month}/${timePeriod.startDate.year}` : "N/A";
      const end = timePeriod.endDate ? `${timePeriod.endDate.month}/${timePeriod.endDate.year}` : "Present";
      return `${start} - ${end}`;
    }
    return "N/A";
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!username) return;

      try {
        const response = await fetch("http://127.0.0.1:8081/profiles/getProfiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) throw new Error("Failed to fetch profiles");

        const data = await response.json();

        if (!Array.isArray(data)) throw new Error("Invalid data format received");
        setProfiles(data);
      } catch (err) {
        setError("No Profiles Available");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [username, isLogin]);

  if (loading) return <p>Loading profiles...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-list">
      {profiles.length > 0 ? (
        profiles.map((profile, profileIndex) => {
          // Ensure experience and education are arrays, parse if necessary
          const safeProfile = {
            ...profile,
            experience: typeof profile.experience === "string" ? JSON.parse(profile.experience) : profile.experience,
            education: typeof profile.education === "string" ? JSON.parse(profile.education) : profile.education,
          };

          return (
            <div className="profile-container" key={profileIndex}>
              <h2>LinkedIn Profile</h2>
              <p>
                <strong>Profile Link: </strong>
                <a href={safeProfile.link || "#"} target="_blank" rel="noopener noreferrer">
                  LinkedIn Portfolio
                </a>
              </p>
              <p><strong>Name:</strong> {safeProfile.name || "N/A"}</p>
              <p><strong>Summary:</strong> {safeProfile.summary || "N/A"}</p>

              <h3>Experience</h3>
              {safeProfile.experience && safeProfile.experience.length > 0 ? (
                <ul>
                  {safeProfile.experience.map((exp, index) => (
                    <li key={index}>
                      <strong>Location:</strong> {exp.locationName || "N/A"} <br />
                      <strong>Company:</strong> {exp.companyName || "N/A"} <br />
                      <strong>Title:</strong> {exp.title || "N/A"} <br />
                      <strong>Geo Location:</strong> {exp.geoLocationName || "N/A"} <br />
                      <strong>Time Period:</strong> {formatTimePeriod(exp.timePeriod)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No experience available</p>
              )}

              <h3>Education</h3>
              {safeProfile.education && safeProfile.education.length > 0 ? (
                <ul>
                  {safeProfile.education.map((edu, index) => (
                    <li key={index}>
                      <strong>School:</strong> {edu.schoolName || "N/A"} <br />
                      <strong>Degree:</strong> {edu.degreeName || "N/A"} <br />
                      <strong>Major:</strong> {edu.fieldOfStudy || "N/A"} <br />
                      <strong>Time Period:</strong> {formatTimePeriod(edu.timePeriod)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No education available</p>
              )}
            </div>
          );
        })
      ) : (
        <p>No profiles available.</p>
      )}
    </div>
  );
}

export default ProfileList;
