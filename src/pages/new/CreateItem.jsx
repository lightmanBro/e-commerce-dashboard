import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import "./CreateItem.scss";

const CreateItem = () => {
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [files, setFiles] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithFiles = new FormData();
      Object.keys(formData).forEach((key) => formDataWithFiles.append(key, formData[key]));
      files.forEach((file) => formDataWithFiles.append("files", file));

      const response = await axios.post("/api/items", formDataWithFiles, {
        headers: {
          Authorization: `Bearer {currentUser.token}`,
        },
      });
      setSuccessMessage("Item created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/items");
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="createItem">
      <Sidebar />
      <div className="createItemContainer">
        <Navbar />
        <div className="top">
          <h1>Create Item</h1>
          {successMessage && <div className="successMessage">{successMessage}</div>}
        </div>
        <div className="bottom">
          <form onSubmit={handleSubmit}>
            <div className="formInput">
              <label>Item Name</label>
              <input
                type="text"
                name="itemName"
                placeholder="Enter item name"
                onChange={handleInputChange}
              />
            </div>
            <div className="formInput">
              <label>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                onChange={handleInputChange}
              />
            </div>
            <div className="formInput">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter description"
                onChange={handleInputChange}
              />
            </div>
            <div className="upload-box" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag & drop some files here, or click to select files</p>
            </div>
            <div className="preview">
              {files.map((file, index) => (
                <img key={index} src={URL.createObjectURL(file)} alt={`preview ${index}`} className="preview-image" />
              ))}
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
