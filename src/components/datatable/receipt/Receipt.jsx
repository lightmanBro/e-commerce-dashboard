import React from 'react';
import './Receipt.scss';
// import logo from '/mnt/data/citratech logo.png';

const Receipt = ({ items, totalPrice }) => {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="receipt">
      <div className="receipt-header">
        <div className="logo">
          {/* <img src={logo} alt="Citratech Nig Ltd Logo" /> */}
        </div>
        <h1>Citratech Solar</h1>
      </div>
      <div className="receipt-body">
        <h2>Receipt</h2>
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
      <div className="receipt-footer">
        <p>Date: {currentDate}</p>
        <p>Disclaimer: This receipt is proof of purchase. Please keep it for your records.</p>
        <p>Contact: enquiry@citratechsolar.com</p>
      </div>
    </div>
  );
};

export default Receipt;
