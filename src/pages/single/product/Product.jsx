import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import Chart from "../../../components/chart/Chart";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import { useAuth } from "../../../context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./Product.scss";

const stats = [
  { month: "January", stock: 100, orders: 50 },
  { month: "February", stock: 90, orders: 45 },
  { month: "March", stock: 85, orders: 60 },
  { month: "April", stock: 80, orders: 55 },
  { month: "May", stock: 75, orders: 70 },
  { month: "June", stock: 70, orders: 65 },
];

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountExpiry, setDiscountExpiry] = useState(new Date());
  const navigate = useNavigate();
  const {user,token} = useAuth();
 
  useEffect(() => {
    // Fetch product using productId
    axios
      .get(`http://127.0.0.1:4000/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { product, prices } = res.data;
        setProduct(product);
        setPrice(prices);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [productId, token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = (event, editedProduct) => {
    event.preventDefault();
    // Save the updated product data
    axios
      .put(`http://127.0.0.1:4000/update-item/${productId}`, editedProduct)
      .then(() => {
        setProduct(editedProduct); // Update the local product state
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error saving product:", error);
      });
  };

  const handleDiscountSave = () => {
    axios
      .post(
        `http://127.0.0.1:4000/product/${productId}/discount`,
        { discount, discountOfferExpires: discountExpiry },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setProduct(res.data.product);
        setIsDiscountModalOpen(false);
      })
      .catch((error) => {
        console.error("Error saving discount:", error);
      });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar user={user} />
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
            <Chart
              aspect={2 / 1}
              title="Product purchasing details (Last 6 months)"
              data={stats}
            />
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
    scheduledDate: product.scheduledDate
      ? new Date(product.scheduledDate)
      : new Date(),
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
        Short Description
        <textarea
          name="shortDesc"
          value={editedProduct.shortDesc}
          onChange={handleChange}></textarea>
        <label></label>
        Additional Info
        <textarea
          name="additionalInfo"
          value={editedProduct.additionalInfo}
          onChange={handleChange}></textarea>
        <label></label>
        Specification
        <textarea
          name="specification"
          value={editedProduct.specification}
          onChange={handleChange}></textarea>
        <label></label>
        {/* Add other product fields */}
        <label>
          Status:
          <select
            name="status"
            value={editedProduct.status}
            onChange={handleChange}>
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
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
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
