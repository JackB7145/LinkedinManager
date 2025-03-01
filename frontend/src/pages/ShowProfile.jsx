//Importing dependencies
import React, { useContext } from "react";
import "../styles/ShowProfile.css";
import { AuthContext } from "../context/AuthContext";

function ShowProfile({ profileData, profileHide }) {

  //Initializing all states and fields used within the component
  const { isLogin, username } = useContext(AuthContext);

  //If no profile data is passed, show a message
  if (!profileData) {
    return <p>No profile data available</p>;
  }

  //Helper function to format time period
  const formatTimePeriod = (timePeriod) => {
    if (timePeriod && typeof timePeriod === "object") {
      const start = timePeriod.startDate
        ? `${timePeriod.startDate.month}/${timePeriod.startDate.year}`
        : "N/A";
      const end = timePeriod.endDate
        ? `${timePeriod.endDate.month}/${timePeriod.endDate.year}`
        : "Present";
      return `${start} - ${end}`;
    }
    return "N/A";
  };

  //Default profileData properties if they are undefined
  const safeProfileData = {
    link: profileData.link || "N/A",
    name: profileData.name || "N/A",
    summary: profileData.summary || "N/A",
    experience: profileData.experience || [],
    education: profileData.education || [],
  };

  //onSubmit save method
  const handleSaveProfile = async () => {
    try {
      //Prepare the profile data to be sent in the request body
      const profileDataToSave = {
        username,
        name: safeProfileData.name,
        summary: safeProfileData.summary,
        experience: JSON.stringify(safeProfileData.experience) || "N/A",  //Convert experience to string if necessary
        education: JSON.stringify(safeProfileData.education) || "N/A",  //Convert education to string if necessary
        link: safeProfileData.link || "N/A"
      };
  
      //Log the request body to check if the structure is correct
      console.log("Request Body:", JSON.stringify(profileDataToSave));
  
      //Send the profile data to the backend API
      const response = await fetch("http://127.0.0.1:8081/profiles/addProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileDataToSave), //Send the profile data
      });
  
      if (response.ok) {
        //Profile was added successfully
        alert("Profile saved successfully!");
        //Refresh the page
        window.location.reload();
        //Close the profile modal
        profileHide();
      } else {
        alert("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving the profile.");
    }
  };

  //Returning all applicable content for the profile component
  return (
    <div className="profile-container">
      <h2>LinkedIn Profile</h2>
      <p>
        <strong>Profile Link: </strong>
        <a href={safeProfileData.link} target="_blank" rel="noopener noreferrer">
          LinkedIn Portfolio
        </a>
      </p>
      <p><strong>Name:</strong> {safeProfileData.name}</p>
      <p><strong>Summary:</strong> {safeProfileData.summary}</p>

      <h3>Experience</h3>
      {safeProfileData.experience.length > 0 ? (
        <ul>
          {safeProfileData.experience.map((exp, index) => (
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
      {safeProfileData.education.length > 0 ? (
        <ul>
          {safeProfileData.education.map((edu, index) => (
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
      {
        isLogin ? (<button onClick={handleSaveProfile}>Save</button>) :
        ("")
      }
      
    </div>
  );
}

export default ShowProfile;
