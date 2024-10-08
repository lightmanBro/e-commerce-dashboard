import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewModal from "./ReviewModal";
import "./Review.scss";

const ReviewPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const { data } = await axios.get(`https://api.citratechsolar.com/orders/user/${userId}`);
        const items = data.data.flatMap(order => order.items.map(item => ({
          ...item,
          orderDate: order.orderDate,
        })));
        setOrderItems(items);
        console.log(items);
      } catch (error) {
        console.error("Error fetching order items:", error);
      }
    };

    fetchOrderItems();
  }, [userId]);

  const handleReviewSubmit = async (productId, rating, comment) => {
    try {
      await axios.post(`https://api.citratechsolar.com/product/review/${productId}`, {
        rating,
        comment,
      });
      alert("Review submitted successfully!");
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="review-page">
      <h2>Your Ordered Products</h2>
      <div className="order-list">
        {orderItems.map((item) => (
          <div className="order-item" key={item._id}>
            <img src={`https://api.citratechsolar.com/item-media-files/${item.productId.mediaFilesPicture[0]}`} alt={item.productTitle} />
            <div className="item-details">
              <p><strong>Title:</strong> {item.productTitle}</p>
              <p><strong>Price:</strong> ₦{item.price}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Date:</strong> {new Date(item.orderDate).toLocaleDateString()}</p>
            </div>
            <button className="review-button" onClick={() => setSelectedProduct(item)}>Review</button>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default ReviewPage;
