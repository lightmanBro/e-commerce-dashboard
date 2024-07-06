import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from "../../../context/AuthContext";

import "./Order.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";

const OrderProcessingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeliveryFields, setShowDeliveryFields] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryType, setDeliveryType] = useState("hours");
  const navigate = useNavigate();
  const {token,user} = useAuth()

  console.log(token);
  useEffect(() => {
    fetchOrderDetails(orderId);
  }, [orderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:4000/order/${orderId}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.data;
      console.log(data);

      setOrder({
        id: data.id || "N/A",
        customerName: `${data.customer.firstName} ${data.customer.lastName}` || "N/A",
        items: data.items.length
          ? data.items
          : [
              {
                id: 1,
                name: "Wireless Headphones",
                quantity: 2,
                price: 99.99,
                status: "ship",
              },
              {
                id: 2,
                name: "Smartphone",
                quantity: 1,
                price: 699.99,
                status: "unship",
              },
            ],
        paymentStatus: data.paid || "N/A",
        paymentMethod: data.paymentMethod || "N/A",
        status: data.status || "N/A",
        trackingNumber: data.orderId || "N/A",
        email: data.customer.email,
        deliveryAddress: data.deliveryAddress || "N/A",
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch order details", error);
      setOrder({
        id: "N/A",
        customerName: "N/A",
        items: [
          {
            id: 1,
            name: "Wireless Headphones",
            quantity: 2,
            price: 99.99,
            status: "ship",
          },
          {
            id: 2,
            name: "Smartphone",
            quantity: 1,
            price: 699.99,
            status: "unship",
          },
        ],
        paymentStatus: "N/A",
        paymentMethod: "N/A",
        status: "N/A",
        trackingNumber: "N/A",
        deliveryAddress: "N/A",
      });
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:4000/orders/${orderId}/status`,
        { status: newStatus, deliveryTime, deliveryType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.data;
      console.log(data);
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: data.status || prevOrder.status,
        deliveryDate: data.order?.deliveryDate || prevOrder.deliveryDate,
      }));
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };
  

  const handleItemStatusChange = async (itemId, newItemStatus) => {
    console.log(itemId, newItemStatus, orderId);
    try {
      const response = await axios.put(`http://127.0.0.1:4000/orders/${orderId}/${itemId}/${newItemStatus}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.ok){
        setOrder((prevOrder) => ({
          ...prevOrder,
          items: prevOrder.items.map((item) =>
            item._id === itemId ? { ...item, status: newItemStatus } : item
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update item status", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order">
      <Sidebar />
      <div className="orderContainer">
      <Navbar user={user}/>
        <h1>Order Processing</h1>
        <div className="processContainer">
          <div className="top">
            <hr />
            <OrderDetails order={order} handleItemStatusChange={handleItemStatusChange} />
            <OrderStatus
              status={order.status}
              updateStatus={handleUpdateStatus}
              showDeliveryFields={showDeliveryFields}
              setShowDeliveryFields={setShowDeliveryFields}
              deliveryTime={deliveryTime}
              setDeliveryTime={setDeliveryTime}
              deliveryType={deliveryType}
              setDeliveryType={setDeliveryType}
            />
          </div>
          <div className="bottom">
            <PaymentInfo paymentStatus={order.paid} paymentMethod={order.paymentMethod} />
            <div className="address">
              <h1>Delivery Address:</h1>
              {order.deliveryAddress}
            </div>
            <TrackingInfo trackingNumber={order.trackingNumber} />
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetails = ({ order, handleItemStatusChange }) => (
  <div>
    <h2>Order Details</h2>
    <p>Order ID: {order.trackingNumber}</p>
    <p>Customer Name: {order.customerName}</p>
    <p>Email: {order.email}</p>
    <List items={order.items} handleItemStatusChange={handleItemStatusChange} />
  </div>
);

const OrderStatus = ({
  status,
  updateStatus,
  showDeliveryFields,
  setShowDeliveryFields,
  deliveryTime,
  setDeliveryTime,
  deliveryType,
  setDeliveryType,
}) => (
  <div>
    <h2>Order Status</h2>
    <p>{status}</p>
    <div className="action-buttons">
      <button onClick={() => setShowDeliveryFields(!showDeliveryFields)}>Mark as Shipped</button>
      <button onClick={() => updateStatus("delivered")}>Mark as Delivered</button>
      <button onClick={() => updateStatus("cancelled")}>Cancel Order</button>
    </div>
    {showDeliveryFields && (
      <div className="delivery-fields">
        <label>
          Delivery Type:
          <select
            value={deliveryType}
            onChange={(e) => {
              setDeliveryType(e.target.value);
              setDeliveryTime("");
            }}
          >
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </label>
        {deliveryType === "hours" ? (
          <label>
            Delivery Time:
            <input type="number" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
          </label>
        ) : (
          <label>
            Select Delivery Date:
            <input type="date" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
          </label>
        )}
        <button
          onClick={() => {
            updateStatus("shipped");
            setShowDeliveryFields(false);
          }}
        >
          Confirm
        </button>
      </div>
    )}
  </div>
);

const PaymentInfo = ({ paymentStatus, paymentMethod }) => (
  <div>
    <h2>Payment Information</h2>
    <p>Status: {paymentStatus}</p>
    <p>Method: {paymentMethod}</p>
  </div>
);

const TrackingInfo = ({ trackingNumber }) => (
  <div>
    <h2>Tracking Information</h2>
    <p>Tracking Number: {trackingNumber}</p>
  </div>
);

const List = ({ items, handleItemStatusChange }) => (
  <TableContainer component={Paper} className="table">
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell className="tableCell" align="right">
            Product ID
          </TableCell>
          <TableCell className="tableCell" align="right">
            Product
          </TableCell>
          <TableCell className="tableCell" align="right">
            Quantity
          </TableCell>
          <TableCell className="tableCell" align="right">
            Price
          </TableCell>
          <TableCell className="tableCell" align="right">
            Status
          </TableCell>
          <TableCell className="tableCell" align="right">
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item._id}>
            <TableCell className="tableCell" align="right">
              {item.productId?.findId || "N/A"}
            </TableCell>
            <TableCell className="tableCell" align="right">
              {item.productId?.productTitle || "N/A"}
            </TableCell>
            <TableCell className="tableCell" align="right">
              {item.quantity}
            </TableCell>
            <TableCell className="tableCell" align="right">
              {item.price}
            </TableCell>
            <TableCell className="tableCell" align="right">
              {item.status}
            </TableCell>
            <TableCell className="tableCell" align="right">
              <select
                value={item.status}
                onChange={(e) => handleItemStatusChange(item._id, e.target.value)}
              >
                <option value="ship" disabled={item.status === "ship"}>
                  Ship
                </option>
                <option value="unship" disabled={item.status === "unship"}>
                  Unship
                </option>
                <option value="delivered" disabled={item.status === "delivered"}>
                  Delivered
                </option>
                <option value="unship" disabled={item.status === "unship"}>
                  Unship
                </option>
              </select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default OrderProcessingPage;
