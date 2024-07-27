import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./New.scss";

const New = ({ inputs, title }) => {
 
  const [formData, setFormData] = useState({});
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
  const navigate = useNavigate();
  const [token, setToken] = useState(Cookies.get('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const storedToken = Cookies.get('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setToken(storedToken);
    setUser(storedUser);
    const fetchClassData = async () => {
      if (!token) return;
  
      try {
        const res = await axios.get("https://api.citratechsolar.com/get-class-data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { brand, category, subCategory } = res.data;
        setBrands(brand);
        setCategories(category);
        setSubcategories(subCategory);
      } catch (error) {
        console.error("Error fetching class data:", error);
        // Optionally handle errors such as invalid tokens
      }
    };
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchClassData();
    }
  }, [navigate,token]);

  
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
      });

      let endpoint = "";
      if (title === "Add new Product") {
        endpoint = "https://api.citratechsolar.com/create-new-item";
      } else if (title === "Add new User") {
        endpoint = "https://api.citratechsolar.com/support/register";
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
      endpoint = "https://api.citratechsolar.com/new-class-data";
      newItem = newBrand;
    } else if (modal.type === "category") {
      endpoint = "https://api.citratechsolar.com/new-class-data";
      newItem = newCategory;
    } else if (modal.type === "subcategory") {
      endpoint = "https://api.citratechsolar.com/new-class-data";
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

  const handleDeleteButtonClick = (item, type) => {
    setModal({ type: "delete", show: true, data: { item, type } });
  };

  const handleDeleteItem = async () => {
    const { item, type } = modal.data;

    try {
        const response = await axios.delete("https://api.citratechsolar.com/delete-class-data", {
            headers: { Authorization: `Bearer ${token}` },
            data: { type, title: item } // Send the data in the body of the request
        });

        if (response.status === 200) {
            if (type === "category") {
                setCategories(categories.filter((category) => category !== item));
            } else if (type === "subcategory") {
                setSubcategories(subcategories.filter((subcategory) => subcategory !== item));
            }

            setSuccessMessage(`${type.slice(0, -1)} deleted successfully!`);
            setModal({ ...modal, show: false });
        }
    } catch (error) {
      closeModal()
        console.error(`Error deleting ${type}:`, error);
    }
};

  
  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

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
                    placeholder={input.placeholder}
                    name={input.name}
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
                      <option value="">Select a brand</option>
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
                    {categories.map((category) => (
                      <div key={category} className="categoryItem">
                        <input
                          type="checkbox"
                          name="categories"
                          value={category}
                          checked={formData.categories?.includes(category) || false}
                          onChange={() => handleSelectItem(category, "categories")}
                        />
                        <span>{category}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteButtonClick(category, "category")}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setModal({ type: "category", show: true })}
                    >
                      Add new category
                    </button>
                  </div>
                  <div className="formInput">
                    <label>Subcategories</label>
                    {subcategories.map((subcategory) => (
                      <div key={subcategory} className="subcategoryItem">
                        <input
                          type="checkbox"
                          name="subcategories"
                          value={subcategory}
                          checked={formData.subcategories?.includes(subcategory) || false}
                          onChange={() => handleSelectItem(subcategory, "subcategories")}
                        />
                        <span>{subcategory}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteButtonClick(subcategory, "subcategory")}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setModal({ type: "subcategory", show: true })}
                    >
                      Add new subcategory
                    </button>
                  </div>
                </>
              )}
              {title === "Add new Product" && (
                <>
                  <div className="formInput">
                    <label>Status</label>
                    <select
                      name="itemStatus"
                      value={itemStatus}
                      onChange={(e) => setItemStatus(e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="publish">Publish</option>
                      <option value="schedule">Schedule</option>
                    </select>
                  </div>
                  {itemStatus === "schedule" && (
                    <div className="formInput">
                      <label>Publish Date</label>
                      <input
                        type="datetime-local"
                        name="publishDate"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
        {modal.show && (
          <div className="modal">
            <div className="modalContent">
              <h2>
                {modal.type === "delete"
                  ? `Delete ${modal.data.type.slice(0, -1)}`
                  : `Add new ${modal.type}`}
              </h2>
              {modal.type === "delete" ? (
                <>
                  <p>
                    Are you sure you want to delete {modal.data.item} from{" "}
                    {modal.data.type}?
                  </p>
                  <button onClick={handleDeleteItem}>Yes</button>
                  <button onClick={closeModal}>No</button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={
                      modal.type === "brand"
                        ? newBrand
                        : modal.type === "category"
                        ? newCategory
                        : newSubcategory
                    }
                    onChange={(e) =>
                      modal.type === "brand"
                        ? setNewBrand(e.target.value)
                        : modal.type === "category"
                        ? setNewCategory(e.target.value)
                        : setNewSubcategory(e.target.value)
                    }
                    placeholder={`Enter new ${modal.type}`}
                  />
                  <button onClick={handleAddItem}>Add</button>
                  <button onClick={closeModal}>Cancel</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default New;
