import React from 'react';

const Reviews = ({ reviews }) => {
  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {reviews.map((review, index) => (
        <div key={index} className="review">
          <p><strong>{review.customer.name}</strong></p>
          <p>{review.comment}</p>
          <p>Rating: {review.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
