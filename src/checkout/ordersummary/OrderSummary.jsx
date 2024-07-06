import React from "react";
import "./OrderSummary.scss";

const OrderSummary = ({
  cartItems,
  onIncreaseItemCount,
  onDecreaseItemCount,
  onDeleteCartItem,
}) => {
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button
            onClick={() => {
              /* Logic to navigate to /product lists */
            }}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="item-list">
          {cartItems.map((item) => (
            <div key={item._id} className="item">
              <div className="img">
                <img
                  src={`http://127.0.0.1:4000/item-media-files/${item.productId.mediaFilesPicture[0]}`}
                  alt={item.productId.productTitle}
                />
              </div>
              <div className="item-details">
                <div className="det">
                  <p>{item.productId.productTitle}</p>
                  <p>Price: ₦{item.productId.price}</p>
                </div>
                <div className="item-count">
                  <button
                    onClick={() =>
                      onDecreaseItemCount(
                        item._id,
                        item.productId._id,
                        item.quantity
                      )
                    }>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      onIncreaseItemCount(
                        item._id,
                        item.productId._id,
                        item.quantity
                      )
                    }>
                    +
                  </button>
                </div>
              </div>
              <div className="delete-button">
                <button onClick={() => onDeleteCartItem(item.productId._id)}>
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total Price Summary */}
      <div className="total-price-summary">
        <h3>Total Price: ₦{totalPrice}</h3>
      </div>
    </div>
  );
};

export default OrderSummary;
