import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import "./New.scss";

const New = ({ inputs, title }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [itemStatus, setItemStatus] = useState("draft");
  const [publishDate, setPublishDate] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [modal, setModal] = useState({ type: "", show: false, data: null });
  const [successMessage, setSuccessMessage] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchClassData();
    }
  }, [token, user, navigate]);

  const fetchClassData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:4000/get-class-data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { brand, category, subCategory } = res.data;
      setBrands(brand);
      setCategories(category);
      setSubcategories(subCategory);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 5,
    onDrop: useCallback((acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    }, []),
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const itemFormData = new FormData();
      itemFormData.append("status", itemStatus);
      itemFormData.append("publishDate", publishDate);

      Object.keys(formData).forEach((key) => {
        itemFormData.append(key, formData[key]);
      });

      files.forEach((file) => {
        itemFormData.append(`files`, file);
        console.log(file)
      });
      
      console.log(itemFormData.entries());

      let endpoint = "";
      if (title === "Add new Product") {
        endpoint = "http://127.0.0.1:4000/create-new-item";
      } else if (title === "Add new User") {
        endpoint = "http://127.0.0.1:4000/support/register";
      }

      await axios.post(endpoint, itemFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccessMessage(`${title.split(" ")[2]} created successfully!`);
    } catch (error) {
      console.error(`Error creating ${title}:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleBrandChange = (e) => {
    const { value } = e.target;
    if (value === "add-new") {
      setModal({ type: "brand", show: true, data: null });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        brand: value,
      }));
    }
  };

  const handleAddItem = async () => {
    let endpoint = "";
    let newItem = "";
    if (modal.type === "brand") {
      endpoint = "http://127.0.0.1:4000/new-class-data";
      newItem = newBrand;
    } else if (modal.type === "category") {
      endpoint = "http://127.0.0.1:4000/new-class-data";
      newItem = newCategory;
    } else if (modal.type === "subcategory") {
      endpoint = "http://127.0.0.1:4000/new-class-data";
      newItem = newSubcategory;
    }

    try {
      const response = await axios.post(endpoint, {
        type: modal.type,
        title: newItem,
      });

      if (modal.type === "brand") {
        setBrands([...brands, response.data]);
        setSuccessMessage("Brand added successfully!");
        setNewBrand("");
      } else if (modal.type === "category") {
        setCategories([...categories, response.data]);
        setSuccessMessage("Category added successfully!");
        setNewCategory("");
      } else if (modal.type === "subcategory") {
        setSubcategories([...subcategories, response.data]);
        setSuccessMessage("Subcategory added successfully!");
        setNewSubcategory("");
      }

      setModal({ ...modal, show: false });
    } catch (error) {
      console.error(`Error adding ${modal.type}:`, error);
    }
  };

  const handleSelectItem = (item, type) => {
    setFormData((prevFormData) => {
      const items = prevFormData[type] || [];
      return {
        ...prevFormData,
        [type]: items.includes(item)
          ? items.filter((i) => i !== item)
          : [...items, item],
      };
    });
  };

  const handleLongPress = (item, type) => {
    setModal({ type: "delete", show: true, data: { item, type } });
  };

  const handleDeleteItem = async () => {
    const { item, type } = modal.data;

    let endpoint = "";
    if (type === "category") {
      endpoint = `http://127.0.0.1:4000/delete-category/${item}`;
    } else if (type === "subcategory") {
      endpoint = `http://127.0.0.1:4000/delete-subcategory/${item}`;
    }

    try {
      await axios.delete(endpoint);

      if (type === "category") {
        setCategories(categories.filter((category) => category !== item));
      } else if (type === "subcategory") {
        setSubcategories(subcategories.filter((subcategory) => subcategory !== item));
      }

      setSuccessMessage(`${type.slice(0, -1)} deleted successfully!`);
      setModal({ ...modal, show: false });
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  if (user.role === "customer" || user.role === "sales") {
    return (
      <div className="new">
        <Sidebar />
        <div className="newContainer">
          <Navbar />
          <div className="top">
            <h1>This page doesn't exist</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar user={user} />
        <div className="top">
          <h1>{title}</h1>
          {successMessage && <div className="successMessage">{successMessage}</div>}
        </div>
        <div className="bottom">
          <div className="left">
            {title === "Add new User" && (
              <div className="drag-and-drop-area" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
              <div className="image-previews">
                {files.map((file) => (
                  <img key={file.name} src={file.preview} alt={file.name} />
                ))}
              </div>
            </div>
            )}
            {title === "Add new Product" && (
              <div className="drag-and-drop-area" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <div className="image-previews">
                  {files.map((file) => (
                    <img key={file.name} src={file.preview} alt={file.name} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="right">
            <form onSubmit={handleFormSubmit}>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={formData[input.name] || ""}
                    onChange={handleInputChange}
                  />
                </div>
              ))}

              {title === "Add new Product" && (
                <>
                  <div className="formInput">
                    <label>Brand</label>
                    <select
                      name="brand"
                      value={formData.brand || ""}
                      onChange={handleBrandChange}
                    >
                      <option value="" disabled>
                        Select a brand
                      </option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                      <option value="add-new">Add new brand</option>
                    </select>
                  </div>

                  <div className="formInput">
                    <label>Categories</label>
                    <div className="categoryContainer">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className={`categoryItem ${
                            formData.category &&
                            formData.category.includes(category)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleSelectItem(category, "category")}
                          onTouchStart={() => {
                            this.longPressTimer = setTimeout(
                              () => handleLongPress(category, "category"),
                              2000
                            );
                          }}
                          onTouchEnd={() => {
                            clearTimeout(this.longPressTimer);
                          }}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setModal({ type: "category", show: true, data: null })}
                    >
                      Add new category
                    </button>
                  </div>

                  <div className="formInput">
                    <label>Subcategories</label>
                    <div className="subcategoryContainer">
                      {subcategories.map((subcategory) => (
                        <div
                          key={subcategory}
                          className={`subcategoryItem ${
                            formData.subcategory &&
                            formData.subcategory.includes(subcategory)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleSelectItem(subcategory, "subcategory")
                          }
                          onTouchStart={() => {
                            this.longPressTimer = setTimeout(
                              () => handleLongPress(subcategory, "subcategory"),
                              2000
                            );
                          }}
                          onTouchEnd={() => {
                            clearTimeout(this.longPressTimer);
                          }}
                        >
                          {subcategory}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setModal({ type: "subcategory", show: true, data: null })}
                    >
                      Add new subcategory
                    </button>
                  </div>
                  <div className="formInput">
                    <label>Status</label>
                    <select
                      name="status"
                      value={itemStatus}
                      onChange={(e) => setItemStatus(e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="publish">Publish</option>
                      <option value="schedule">Schedule Publish</option>
                    </select>
                  </div>
                  {itemStatus === "schedule" && (
                    <div className="formInput">
                      <label>Publish Date</label>
                      <input
                        type="date"
                        name="publishDate"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
              {title === "Add new User" && (
                <>
                  <label>User role</label>
                  <select name="role" onChange={handleInputChange} required>
                    <option value="" disabled>Select a role</option>
                    <option value="support">Support</option>
                    <option value="sales">Sales</option>
                  </select>
                </>
              )}

              <button type="submit">Add {title.split(' ')[2]}</button>
            </form>
          </div>
        </div>
      </div>

      {modal.show && modal.type === "brand" && (
        <ModalAddItem
          title="Add New Brand"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
          onAdd={handleAddItem}
          onClose={closeModal}
        />
      )}

      {modal.show && modal.type === "category" && (
        <ModalAddItem
          title="Add New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onAdd={handleAddItem}
          onClose={closeModal}
        />
      )}

      {modal.show && modal.type === "subcategory" && (
        <ModalAddItem
          title="Add New Subcategory"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
          onAdd={handleAddItem}
          onClose={closeModal}
        />
      )}

      {modal.show && modal.type === "delete" && (
        <ModalDeleteItem
          title={`Delete ${modal.data.type.slice(0, -1)}`}
          message={`Are you sure you want to delete this ${modal.data.type.slice(0, -1)}?`}
          onDelete={handleDeleteItem}
          onCancel={closeModal}
        />
      )}

      {successMessage && <div className="successMessage">{successMessage}</div>}
    </div>
  );
};

const ModalAddItem = ({ title, value, onChange, onAdd, onClose }) => (
  <div className="modal">
    <div className="modalContent">
      <h2>{title}</h2>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={`${title} Name`}
      />
      <button onClick={onAdd}>Add {title.split(" ")[1]}</button>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

const ModalDeleteItem = ({ title, message, onDelete, onCancel }) => (
  <div className="modal">
    <div className="modalContent">
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  </div>
);

export default New;
