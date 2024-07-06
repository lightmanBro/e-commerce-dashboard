import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CreateUser.scss";

const CreateUser = () => {
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users", formData, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setSuccessMessage("User created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/users");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="createUser">
      <Sidebar />
      <div className="createUserContainer">
        <Navbar />
        <div className="top">
          <h1>Create User</h1>
          {successMessage && <div className="successMessage">{successMessage}</div>}
        </div>
        <div className="bottom">
          <form onSubmit={handleSubmit}>
            <div className="formInput">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                onChange={handleInputChange}
              />
            </div>
            <div className="formInput">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                onChange={handleInputChange}
              />
            </div>
            <div className="formInput">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
