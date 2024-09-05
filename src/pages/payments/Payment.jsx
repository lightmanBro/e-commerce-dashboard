import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import PaymentSearch from "./PaymentSearch";
import PaymentList from "./PaymentList";
import Cookies from 'js-cookie';
import axios from "axios";
import "./Payment.scss";

function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:4000/payments", {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` }
        });
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch payments");
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleSearch = async ({ query, searchBy }) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:4000/payments/search?searchBy=${searchBy}&query=${query}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );
      setPayments(response.data);
    } catch (error) {
      setError(`No payment record found for ${query} using ${searchBy}`);
    }
  };

  return (
    <div className="payment">
      <Sidebar />
      <div className="payment-container">
        <Navbar />
        <div className="top">
          <div className="search">
            <PaymentSearch onSearch={handleSearch} />
          </div>
          <PaymentList payments={payments} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default Payment;
