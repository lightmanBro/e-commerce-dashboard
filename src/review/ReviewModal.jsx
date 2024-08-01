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
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Rate this Product</h2>
        <div className="product-details">
          <img src={`https://api.citratechsolar.com/item-media-files/${product.productId.mediaFilesPicture[0]}`} alt={product.productTitle} />
          <div>
            <p><strong>{product.productTitle}</strong></p>
            <p>Delivered On {new Date(product.orderDate).toLocaleDateString()}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-input">
            <label>Tap The Stars To Rate:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? "filled" : ""}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <div className="comment-input">
            <label>Review Title</label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.g I love it!/ I don’t like it!"
            />
          </div>
          <div className="comment-input">
            <label>Detailed Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more about the product"
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="submit">Submit Review</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
