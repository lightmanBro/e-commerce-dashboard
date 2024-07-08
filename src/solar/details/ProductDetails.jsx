import React from "react";
import PropTypes from "prop-types";
import "./ProductDetails.scss";
import DiscountCountdown from "../discount/DiscountCountDown";

const ProductDetails = ({ product, addToCart }) => (
  <div className="product-details">
    <h1>{product.productTitle}</h1>
    <p className="description">{product.shortDesc}</p>
    <p className="details">
      ₦{product.price - product.price * product.discount *1/100}
      {product.discount && (
        <div className="originalPrice">₦{product.price * 1}</div>
      )}
    </p>
    {product.discount > 0 && (
      <DiscountCountdown expiryDate={product.discountOfferExpires} />
    )}
    <button onClick={() => addToCart(product)}>Add to Cart</button>
    <div className="infos">
      <div className="category">
        <span>BRAND</span> <span>{product.brand.toString()}</span>
      </div>
      <div className="category">
        <span>CATEGORY</span> <span>{product.category.toString()}</span>
      </div>
      <div className="additionalinfo">
        <h3>Additional Info</h3>
        <div className="application">
          <p>Application</p>
          <div className="texts">{product.additionalInfo}</div>
        </div>
        <div className="application">
          <p>Specifications</p>
          <div className="texts">{product.specification}</div>
        </div>
      </div>
    </div>
  </div>
);

ProductDetails.propTypes = {
  product: PropTypes.object.isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default ProductDetails;
