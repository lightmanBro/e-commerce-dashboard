import React from "react";
import "./OrderSummary.scss";

const OrderSummary = ({
  cartItems,
  onIncreaseItemCount,
  onDecreaseItemCount,
  onDeleteCartItem,
}) => {
  // Calculate total price with discount
  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.productId.price;
    const discount = item.productId.discount || 0;
    const discountedPrice = price - (price * discount) / 100;
    return total + discountedPrice * item.quantity;
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
            }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="item-list">
          {cartItems.map((item) => {
            const price = item.productId.price;
            const discount = item.productId.discount || 0;
            const discountedPrice = price - (price * discount) / 100;

            return (
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
                    {discount > 0 ? (
                      <>
                        <p>Discounted Price: ₦{discountedPrice.toFixed(2)}</p>
                        <p>Discount: {discount}%</p>
                      </>
                    ) : (
                      <p>Price: ₦{price}</p>
                    )}
                  </div>
                  <div className="item-count">
                    <button
                      onClick={() =>
                        onDecreaseItemCount(
                          item._id,
                          item.productId._id,
                          item.quantity
                        )
                      }
                    >
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
                      }
                    >
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
            );
          })}
        </div>
      )}

      {/* Total Price Summary */}
      <div className="total-price-summary">
        <h3>Total Price: ₦{totalPrice.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default OrderSummary;
