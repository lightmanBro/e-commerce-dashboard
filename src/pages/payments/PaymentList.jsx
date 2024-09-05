import React from "react";
import "./PaymentList.scss";

const PaymentList = ({ payments, loading, error }) => {
  // Conditional rendering based on loading state and error
  if (loading) return <p>Loading payments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="payment-list">
      {payments.length === 0 ? (
        <p>No payments found</p>
      ) : (
        payments.map((payment) => (
          <div key={payment._id} className="payment-item">
            <div>
              <p><strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}</p>
              <p><strong>Payer Name:</strong> {payment.payer_name}</p>
              <p><strong>Phone Number:</strong> {payment.customerReference}</p>
              <p><strong>Amount:</strong> N{payment.amount.toLocaleString()}</p>
              <p><strong>Transaction Reference:</strong> {payment.transactionReference}</p>
              <p><strong>Citratech Reference:</strong> {payment.citratechReference}</p>
              <p><strong>Source Bank:</strong> {payment.source_bank_name}</p>
            </div>
            <p className={`payment-item-status ${payment.paymentCompleted ? "payment-completed" : "payment-pending"}`}>
              {payment.paymentCompleted ? "Completed" : "Pending"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default PaymentList;
