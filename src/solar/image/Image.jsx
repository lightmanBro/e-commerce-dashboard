import React from 'react';
import PropTypes from 'prop-types';
import './Image.scss';

const ProductImage = ({ imageUrl, discount }) => {
  console.log(imageUrl,discount)
  return (
    <div className="product-image">
      {discount > 0 && <span className="discount-badge">{discount}% Off</span>}
      <img src={`http://127.0.0.1:4000/item-media-files/${imageUrl}`} alt="Product" />
    </div>
  );
};
ProductImage.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};
export default ProductImage;
