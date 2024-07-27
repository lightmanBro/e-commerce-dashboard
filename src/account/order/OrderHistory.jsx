import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          `https://api.citratechsolar.com/orders/user/${"66705146dafa4dd0270f2734"}`
        );
        setHistory(response.data)
        console.log(response.data)
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchOrderHistory();
  }, []);
  return <div className="order-history">OrderHistory</div>;
}
