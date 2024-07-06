import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./ProfilePicUpload.scss";

const ProfilePicUpload = ({ profilePic, setProfilePic }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  }, [setProfilePic]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: "image/*" });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop a profile picture here, or click to select one</p>
      )}
      {profilePic && <img src={profilePic} alt="Profile Pic" className="preview" />}
    </div>
  );
};

export default ProfilePicUpload;
