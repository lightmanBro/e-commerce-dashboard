import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./PasswordChangeModal.scss";

const PasswordChangeModal = ({token, isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      await axios.patch(
        "https://api.citratechsolar.com/user/password-reset",
        { oldPassword: currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess("Password changed successfully!");
      onClose();
    } catch (err) {
      setError('Password change not successful');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <h2>Change Password</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Current Password:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <div className="btns">
          <button type="submit">Change Password</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordChangeModal;
