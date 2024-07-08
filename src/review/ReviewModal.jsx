import React, { useState } from "react";
import "./ReviewModal.scss";

const ReviewModal = ({ product, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product.productId._id, rating, comment);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Review Product</h2>
        <div className="product-details">
          <img
            src={`http://127.0.0.1:4000/item-media-files/${product.productId.mediaFilesPicture[0]}`}
            alt={product.productTitle}
          />
          <p>
            <strong>Title:</strong> {product.productTitle}
          </p>
          <p>
            <strong>Price:</strong> ₦{product.price}
          </p>
          <p>
            <strong>Quantity:</strong> {product.quantity}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(product.orderDate).toLocaleDateString()}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="rating-input">
            <label>Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? "filled" : ""}`}
                onClick={() => setRating(star)}>
                ★
              </span>
            ))}
          </div>

          <div className="comment-input">
            <label>Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}></textarea>
          </div>

          <div className="modal-actions">
            <button type="submit">Submit Review</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
