import React, { useState, useEffect } from "react";
import ShippingAddress from "./shippingaddress/ShippingAddress";
import OrderSummary from "./ordersummary/OrderSummary";
import PaymentMethod from "./paymentmethod/PaymentMethod";
import axios from "axios";
import "./CheckoutPage.scss";

const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentType, setPaymentType] = useState(null); // State to track payment type (cash or card)
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showThankYouModal, setShowThankYouModal] = useState(false); // State for showing Thank You modal

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `https://api.citratechsolar.com/cart/${"667050ecdafa4dd0270f272f"}`
      ); // Replace with actual userId
      setCartItems(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error.message);
      setLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(
      `name: ${address.name}, address: ${address.address}, phone: ${address.phone}, state: ${address.state}`
    );
  };

  const handleAddAddress = (address) => {
    // Implement logic to add new address if needed
  };

  const handleUpdateItemCount = async (itemId, productId, newQuantity) => {
    try {
      await axios.put("https://api.citratechsolar.com/cart", {
        userId: "667050ecdafa4dd0270f272f", // Replace with actual user ID
        productId,
        quantity: newQuantity,
      });
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item:", error.message);
    }
  };

  const handleIncreaseItemCount = (itemId, productId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    handleUpdateItemCount(itemId, productId, newQuantity);
  };

  const handleDecreaseItemCount = (itemId, productId, currentQuantity) => {
    const newQuantity = currentQuantity - 1;
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    handleUpdateItemCount(itemId, productId, newQuantity);
  };

  const handleDeleteCartItem = async (productId) => {
    try {
      const response = await axios.post("http://127.0.0.1:4000/cart/delete", {
        userId: "667050ecdafa4dd0270f272f", // Replace with actual user ID
        productId,
      });
      setCartItems(response.data);
    } catch (error) {
      console.error("Error deleting cart item:", error.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select address to continue");
      return;
    }
    console.log(cartItems, paymentType, selectedAddress);
    try {
      const response = await axios.post("https://api.citratechsolar.com/orders/new", {
        items: cartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.count,
        })),
        paymentType, // Cash or Card based on user selection
        deliveryAddress: selectedAddress,
        customer: "667050ecdafa4dd0270f272f", // Replace with actual customer ID
        // Add more data as needed (selectedAddress, cardDetails, etc.)
      });
      console.log("Order placed successfully:", response.data);
      // Handle success: clear cart, show confirmation, etc.
      setShowThankYouModal(true); // Show the Thank You modal
      // setTimeout(() => {
      //   setShowThankYouModal(false); // Hide the Thank You modal after 2 seconds
      // }, 5000); // Adjust timing as needed
      // Clear cart items after placing order
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error.message);
      // Handle error: show error message to user, retry logic, etc.
    }
  };

  const handleSelectPaymentType = (type) => {
    setPaymentType(type);
  };

  const handleToggleAddressForm = () => {
    setShowAddressForm(!showAddressForm);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="checkout-page">
      <div className="left">
        <h2>Shipping Address</h2>
        {showAddressForm && (
          <ShippingAddress
            onSelectAddress={handleSelectAddress}
            onAddAddress={handleAddAddress}
          />
        )}
        <button className="toggleBtn" onClick={handleToggleAddressForm}>
          {showAddressForm ? "Close Address Form" : "Select Address"}
        </button>

        <h2>Payment Method</h2>
        <div className="payment-type-buttons">
          <button onClick={() => handleSelectPaymentType("cash")}>
            Pay Cash on Delivery
          </button>
          <button onClick={() => handleSelectPaymentType("card")}>
            Pay with Card
          </button>
        </div>

        {paymentType === "cash" && (
          <button onClick={handlePlaceOrder}>Place Order</button>
        )}
        {paymentType === "card" && (
          <PaymentMethod onPlaceOrder={handlePlaceOrder} />
        )}

        {/* Thank You Modal */}
        {showThankYouModal && (
          <div className="thank-you-modal">
            <div className="thank-you-content">
              <h2>Thank You!</h2>
              <p>Your order has been successfully placed.</p>
              <p>
                We appreciate your purchase and hope you enjoy your new items.
              </p>
              <button onClick={() => setShowThankYouModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
      <div className="right">
        <OrderSummary
          cartItems={cartItems}
          onIncreaseItemCount={handleIncreaseItemCount}
          onDecreaseItemCount={handleDecreaseItemCount}
          onDeleteCartItem={handleDeleteCartItem}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
