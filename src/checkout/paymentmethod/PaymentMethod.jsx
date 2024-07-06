// src/components/checkout/PaymentMethod.js
import React, { useState } from 'react';
import './PaymentMethod.scss';

const PaymentMethod = ({ onPlaceOrder }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = () => {
    onPlaceOrder(cardDetails);
  };

  return (
    <div className="payment-method">
     <label htmlFor="cardNumber">Card Number</label>
      <input type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleChange} placeholder="Card Number" />
      <label htmlFor="expiryDate">Expiry Date</label>
      <input type="text" name="expiryDate" value={cardDetails.expiryDate} onChange={handleChange} placeholder="Expiry Date (MM/YY)" />
      <label htmlFor="cvv">CVV</label>
      <input type="text" name="cvv" value={cardDetails.cvv} onChange={handleChange} placeholder="CVV" />
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default PaymentMethod;
