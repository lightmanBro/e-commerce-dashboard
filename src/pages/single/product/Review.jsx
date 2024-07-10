import React from 'react';
import StarRating from './StarRating';

const Review = ({ review }) => {
  const formattedDate = new Date(review.date).toLocaleDateString();

  return (
    <div className="review">
      <h4>{review.customer.name}</h4>
      <StarRating rating={review.rating} />
      <p>{review.comment}</p>
      <p className="review-date">{formattedDate}</p>
    </div>
  );
};

export default Review;
