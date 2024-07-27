import React, { useState } from "react";
import axios from "axios";
import "./UpdateDetails.scss";

const UpdateDetails = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleUpdateDetails = async () => {
    try {
      const response = await axios.patch("https://api.citratechsolar.com/users/update-profile", {
        firstName,
        lastName,
        email,
        phone,
      });
      console.log("Update successful:", response.data);
    } catch (error) {
      console.error("Error updating details:", error);
    }
  };

  return (
    <div className="update-details">
      <h3>Update Details</h3>
      <div className="input-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <button onClick={handleUpdateDetails}>Update Details</button>
    </div>
  );
};

export default UpdateDetails;
