import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useDropzone } from 'react-dropzone';
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import Cookies from 'js-cookie';
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
  const [stock, setStock] = useState(null);
  const [available, setAvailable] = useState(null);
  const [rating, setRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountExpiry, setDiscountExpiry] = useState(new Date());
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(Cookies.get('token'));
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:4000/product/${productId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const { product, prices } = res.data;
        setProduct(product);
        setPrice(prices);
        setStock(product.stock);
        setAvailable(product.available);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/product/review/${productId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId, authToken]);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async (event, editedProduct, files) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('productTitle', editedProduct.productTitle);
    formData.append('price', editedProduct.price);
    formData.append('shortDesc', editedProduct.shortDesc);
    formData.append('additionalInfo', editedProduct.additionalInfo);
    formData.append('specification', editedProduct.specification);
    formData.append('status', editedProduct.status);
    formData.append('scheduledDate', editedProduct.scheduledDate);
    formData.append('files', files);
  
    try {
      console.log({...formData.entries()})
      await axios.patch(`http://127.0.0.1:4000/update-item/${productId}`, formData, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      setProduct(editedProduct); // Update the local product state
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };
  

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
                <img
                  crossorigin="anonymous"
                  src={`http://localhost:4000/item-media-files/${img}`}
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

        <DiscountModal
          isOpen={isDiscountModalOpen}
          onClose={() => setIsDiscountModalOpen(false)}
          discount={discount}
          setDiscount={setDiscount}
          discountExpiry={discountExpiry}
          setDiscountExpiry={setDiscountExpiry}
          onSave={handleDiscountSave}
        />
      </div>
    </div>
  );
};

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({
    ...product,
    scheduledDate: product.scheduledDate ? new Date(product.scheduledDate) : new Date(),
    files: [], // to hold the dropped files
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleDateChange = (date) => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      scheduledDate: date,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave(event, editedProduct); // Pass the updated product state
  };

  const handleDrop = (acceptedFiles) => {
    // Check if files are images
    const validFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      files: validFiles,
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*', // Accept only images
  });

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <h2>Edit Product</h2>
      <form onSubmit={handleSave}>
        <label>
          Name:
          <input
            type="text"
            name="productTitle"
            value={editedProduct.productTitle}
            onChange={handleChange}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={editedProduct.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Short Description:
          <textarea
            name="shortDesc"
            value={editedProduct.shortDesc}
            onChange={handleChange}
          ></textarea>
        </label>
        <label>
          Additional Info:
          <textarea
            name="additionalInfo"
            value={editedProduct.additionalInfo}
            onChange={handleChange}
          ></textarea>
        </label>
        <label>
          Specification:
          <textarea
            name="specification"
            value={editedProduct.specification}
            onChange={handleChange}
          ></textarea>
        </label>
        <label>
          Status:
          <select
            name="status"
            value={editedProduct.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="schedule">Scheduled</option>
          </select>
        </label>
        {editedProduct.status === "schedule" && (
          <label>
            Scheduled Date:
            <DatePicker
              selected={editedProduct.scheduledDate}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy h:mm aa"
            />
          </label>
        )}

        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>

        <div className="preview">
          {editedProduct.files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="preview-image"
            />
          ))}
        </div>

        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};



const DiscountModal = ({
  isOpen,
  onClose,
  discount,
  setDiscount,
  discountExpiry,
  setDiscountExpiry,
  onSave,
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal">
      <h2>Set Discount</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}>
        <label>
          Discount:
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            required
          />
        </label>
        <label>
          Discount Expiry Date:
          <DatePicker
            selected={discountExpiry}
            onChange={(date) => setDiscountExpiry(date)}
            dateFormat="dd/MM/yyyy"
            required
          />
        </label>
        <div className="btns">
          <button type="submit">Set Discount</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Product;
