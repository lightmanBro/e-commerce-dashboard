import React from 'react';
import './Receipt.scss';

const Receipt = ({ items, totalPrice }) => {
  return (
    <div className="receipt">
      <div className="watermark">citratechsolar</div>
      <h1>Receipt</h1>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.productTitle}</td>
              <td>₦{item.price}</td>
              <td>{item.quantity}</td>
              <td>₦{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total">
        <h2>Total: ₦{totalPrice}</h2>
      </div>
      <div className="signature">
        <p>Customer Signature: _____________________</p>
      </div>
    </div>
  );
};

export default Receipt;
