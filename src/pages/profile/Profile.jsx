import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Modal from "react-modal";
import Cookies from 'js-cookie';
import "./Profile.scss";
import PasswordChangeModal from "./PasswordChangeModal";
import axios from "axios";

Modal.setAppElement('#root'); // Add this line

const Profile = () => {
  const [authToken, setAuthToken] = useState(Cookies.get('token'));
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
      setAuthToken(authToken);
      setUserData(userData);
  }, [authToken, userData]);

  const handleSaveClick = async (editedUser) => {
    try {
      const response = await axios.patch(
        "https://api.citratechsolar.com/users/update-profile",
        { ...editedUser },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data.status === "Successful") {
        setUserData({ ...editedUser, role: userData.role });
        setIsEditing(false);
        console.log("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handlePasswordChangeClick = () => setIsPasswordModalOpen(true);

  const { email, role, firstName, lastName, phoneNumber } = userData || {};

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <Sidebar />
      <div className="profileContainer">
        <Navbar user={userData} />
        <div className="top">
          <div className="left">
            <div className="title">Profile Information</div>
            {!isEditing ? (
              <div className="item">
                <div className="details">
                  <h1 className="itemTitle">{`${firstName || "No name"} ${lastName || ""}`}</h1>
                  <div className="detailItem">
                    <span className="itemKey">Role:</span>
                    <span className="itemValue">{role}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Email:</span>
                    <span className="itemValue">{email}</span>
                  </div>
                  <div className="detailItem">
                    <span className="itemKey">Contact:</span>
                    <span className="itemValue">{phoneNumber}</span>
                  </div>
                </div>
              </div>
            ) : (
              <EditProfileModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                user={userData}
                onSave={handleSaveClick}
              />
            )}
            <PasswordChangeModal token={authToken}
              isOpen={isPasswordModalOpen}
              onClose={() => setIsPasswordModalOpen(false)}
            />
          </div>
          <div className="right">
            <div className="editBtn" onClick={handleEditClick}>
              Update Profile
            </div>
            <div className="passwordChangeBtn" onClick={handlePasswordChangeClick}>
              Change Password
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="overlay">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={editedUser.firstName || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={editedUser.lastName || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Role:
          <input
            type="text"
            name="role"
            value={editedUser.role || ""}
            onChange={handleChange}
            disabled
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={editedUser.email || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={editedUser.address || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="phoneNumber"
            value={editedUser.phoneNumber || ""}
            onChange={handleChange}
          />
        </label>
        <div className="btns">
          <button type="submit" className="saveBtn">Save Profile</button>
          <button type="button" className="cancelBtn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default Profile;
