import React from 'react';
import Review from '../../pages/single/product/Review';
const Reviews = ({ reviews }) => {
  return (
    <div className="reviews">
      <h2>Reviews</h2>
      {reviews.map((review, index) => (
        <Review review={review}/>
      ))}
    </div>
  );
};

export default Reviews;
