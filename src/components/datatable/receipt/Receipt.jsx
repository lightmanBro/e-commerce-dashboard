import React from 'react';
import './Receipt.scss';
// import logo from '/mnt/data/citratech logo.png';

const Receipt = ({ items, totalPrice }) => {
  return (
    <div className="receipt">
      <div className="watermark">citratechsolar</div>
      <div className="logo">
        {/* <img src={logo} alt="Citratech Nig Ltd Logo" /> */}
      </div>
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
              <td>₦{item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>₦{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total">
        <h2>Total: ₦{totalPrice.toFixed(2)}</h2>
      </div>
      <div className="signature">
        <p>Customer Signature: _____________________</p>
      </div>
    </div>
  );
};

export default Receipt;
