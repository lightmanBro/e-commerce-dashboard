import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import './Image.scss';

const ProductImage = ({ imageUrls, discount }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  // Ensure unique image URLs
  const uniqueImageUrls = [...new Set(imageUrls)];

  return (
    <div className="product-image">
      {discount > 0 && <span className="discount-badge">{discount}% Off</span>}
      <Slider {...settings} className='slider'>
        {uniqueImageUrls.map((url, index) => (
          <div key={index} className="image-container">
            <img src={`https://api.citratechsolar.com/item-media-files/${url}`} alt={`Product ${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

ProductImage.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  discount: PropTypes.number.isRequired,
};

export default ProductImage;
