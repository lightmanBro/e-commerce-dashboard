import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserData.scss";

const UserData = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/user/details/${"6670252561cede15e3036223"}`);
        console.log(response.data);
        setUser(response.data); // Assuming API returns user data object
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return null; // Handle loading state or error state as needed
  }

  return (
    <div className="user-data">
      <h3>User Data</h3>
      <p>First Name: {user.firstName}</p>
      <p>Last Name: {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phone}</p>
    </div>
  );
};

export default UserData;
