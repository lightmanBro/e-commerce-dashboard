import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useDropzone } from "react-dropzone";
import Navbar from "../../../components/navbar/Navbar";
import Cookies from "js-cookie";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./Product.scss";
import MyGaugeComponent from "../../../components/guage/MyCuageComponent";
import Review from "./Review";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountExpiry, setDiscountExpiry] = useState(new Date());
  const authToken = Cookies.get("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  


  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async (event, editedProduct, files) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("productTitle", editedProduct.productTitle);
    formData.append("price", editedProduct.price);
    formData.append("shortDesc", editedProduct.shortDesc);
    formData.append("additionalInfo", editedProduct.additionalInfo);
    formData.append("specification", editedProduct.specification);
    formData.append("status", editedProduct.status);
    formData.append("scheduledDate", editedProduct.scheduledDate);
    editedProduct.files.forEach((file) => {
      formData.append(`files`, file);
    });

    try {
      await axios.patch(
        `http://127.0.0.1:4000/update-item/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteFile = async (filename, productId) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:4000/delete-file/${productId}/${filename}`
      );
      if (response.data.status === "Success") {
        console.log(`File ${filename} deleted successfully.`);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(`Failed to delete file: ${filename}`, error);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:4000/product/review/${productId}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:4000/product/${productId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const { product, prices } = res.data;
        setProduct(product);
        setPrice(prices);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
  
    fetchProduct();
    fetchReviews();
  }, [productId,authToken]);

  const handleDiscountSave = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:4000/product/${productId}/discount`,
        { discount, discountOfferExpires: discountExpiry },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setProduct(res.data.product);
      setIsDiscountModalOpen(false);
    } catch (error) {
      console.error("Error saving discount:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar user={userData} />
        <div className="top">
          <div className="left">
            <div className="editBtn" onClick={handleEditClick}>
              Edit
            </div>
            <div className="title">Information</div>
            {!isEditing ? (
              <div className="item">
                <img
                  crossorigin="anonymous"
                  src={`http://127.0.0.1:4000/item-media-files/${product.mediaFilesPicture[0]}`}
                  alt={product.productTitle}
                  className="itemImg"
                />
                <h1 className="itemTitle">{product.productTitle}</h1>
                <div className="details">
                  <div>
                    <div className="detailItem">
                      <span className="itemKey">Unit Price</span>
                      <span className="itemValue">₦ {product.price}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Stock</span>
                      <span className="itemValue">
                        {product.stock > 0 ? product.stock : "Out of stock"}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Available</span>
                      <span className="itemValue">{product.available}</span>
                    </div>
                  </div>
                  <div>
                    <div className="detailItem">
                      <span className="itemKey">Sold</span>
                      <span className="itemValue">{product.orders}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Percentage Off</span>
                      <span className="itemValue">{product.discount}%</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Status</span>
                      <span className="itemValue">{product.status}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Views</span>
                      <span className="itemValue">{product.views}</span>
                    </div>
                  </div>
                  <button onClick={() => setIsDiscountModalOpen(true)}>
                    Set Discount
                  </button>
                </div>
                <div className="prices">
                  <div className="price-summary">
                    <div className="price-title">Total Product Price</div>
                    <div className="price">
                      ₦{price.totalPrice * product.stock}
                    </div>
                  </div>
                  <div className="price-summary">
                    <div className="price-title">Available Product Price</div>
                    <div className="price">₦{price.availableItemPrice}</div>
                  </div>
                  <div className="price-summary">
                    <div className="price-title">Sold Product Price</div>
                    <div className="price">₦{price.soldItemPrice}</div>
                  </div>
                </div>
              </div>
            ) : (
              <EditProductModal
                className="modal"
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                product={product}
                onSave={handleSaveClick}
              />
            )}
          </div>
          <div className="right">
            <MyGaugeComponent product={product} />
          </div>
        </div>
        <div className="additional-details">
          <div className="shortDesc">
            <h4>Short Description</h4> {product.shortDesc}
          </div>
          <div className="additionalInfo">
            <h4>Additional info</h4> {product.additionalInfo}
          </div>
          <div className="specifications">
            <h4>Specifications</h4> {product.specification}
          </div>
        </div>
        <div className="productImages">
          <h3>Product Images</h3>
          <div className="imgContainer">
            {product.mediaFilesPicture.map((img, index) => (
              <div key={index} className="img">
                <button
                  className="deleteBtn"
                  onClick={() => handleDeleteFile(img,productId)}>
                  X
                </button>
                <img
                  crossorigin="anonymous"
                  src={`http://127.0.0.1:4000/item-media-files/${img}`}
                  alt={`Product ${index + 1}`}
                  className="itemImg"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bottom">
          <h3>Product Review</h3>
          <div className="reviews">
            {reviews.map((review) => (
              <Review key={review._id} review={review} />
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isDiscountModalOpen}
        onRequestClose={() => setIsDiscountModalOpen(false)}
        contentLabel="Discount Modal"
        className="modal">
        <h2>Set Discount</h2>
        <label>
          Discount Percentage:
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </label>
        <label>
          Discount Expiry:
          <DatePicker
            selected={discountExpiry}
            onChange={(date) => setDiscountExpiry(date)}
          />
        </label>
        <button onClick={handleDiscountSave}>Save</button>
      </Modal>
    </div>
  );
};

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({
    ...product,
    files: product.files || [],
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setEditedProduct((prevProduct) => ({
        ...prevProduct,
        files: [...prevProduct.files, ...acceptedFiles],
      }));
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleSaveClick = (event) => {
    onSave(event, editedProduct, editedProduct.files);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Product"
      className="modal">
      <h2>Edit Product</h2>
      <form>
        <label>
          Product Title:
          <input
            type="text"
            name="productTitle"
            value={editedProduct.productTitle}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Short Description:
          <textarea
            name="shortDesc"
            value={editedProduct.shortDesc}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Additional Information:
          <textarea
            name="additionalInfo"
            value={editedProduct.additionalInfo}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Specification:
          <textarea
            name="specification"
            value={editedProduct.specification}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={editedProduct.status}
            onChange={handleInputChange}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </label>
        {editedProduct.status === "scheduled" && (
          <label>
            Scheduled Date:
            <DatePicker
              selected={new Date(editedProduct.scheduledDate)}
              onChange={(date) =>
                setEditedProduct((prevProduct) => ({
                  ...prevProduct,
                  scheduledDate: date,
                }))
              }
            />
          </label>
        )}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <div className="uploaded-images">
          {editedProduct.files.map((file, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
              <button
                onClick={() =>
                  setEditedProduct((prevProduct) => ({
                    ...prevProduct,
                    files: prevProduct.files.filter((_, i) => i !== index),
                  }))
                }>
                X
              </button>
            </div>
          ))}
        </div>
        <button type="submit" onClick={handleSaveClick}>
          Save
        </button>
      </form>
    </Modal>
  );
};

export default Product;
