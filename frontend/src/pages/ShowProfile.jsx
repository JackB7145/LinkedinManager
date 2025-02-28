import React from "react";
import "../styles/ShowProfile.css";

function ShowProfile({ profileData }) {
  if (!profileData) {
    return <p>No profile data available</p>;
  }

  const formatTimePeriod = (timePeriod) => {
    if (timePeriod && typeof timePeriod === "object") {
      const start = timePeriod.startDate ? `${timePeriod.startDate.month}/${timePeriod.startDate.year}` : "N/A";
      const end = timePeriod.endDate ? `${timePeriod.endDate.month}/${timePeriod.endDate.year}` : "Present";
      return `${start} - ${end}`;
    }
    return "N/A";
  };

  return (
    <div className="profile-container">
      <h2>LinkedIn Profile</h2>
      <p><strong>Profile Link: </strong><a href={profileData.link}>LinkedIn Portfolio</a></p>
      <p><strong>Name:</strong> {profileData.name}</p>
      <p><strong>Summary:</strong> {profileData.summary}</p>
      
      <h3>Experience</h3>
      {Array.isArray(profileData.experience) ? (
        <ul>
          {profileData.experience.map((exp, index) => (
            <li key={index}>
              <strong>Location:</strong> {exp.locationName} <br />
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
      {Array.isArray(profileData.education) ? (
        <ul>
          {profileData.education.map((edu, index) => (
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

      <button>Save</button>
    </div>
  );
}

export default ShowProfile;
