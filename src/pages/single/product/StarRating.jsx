// StarRating.jsx
import React from 'react';
import './Review.scss'
const StarRating = ({ rating }) => {
    console.log(rating*1);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating *1) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else {
      stars.push(<span key={i} className="star">★</span>);
    }
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
