import React, { useEffect, useState } from "react";
import "./Single.scss";
import "./SingleTable.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import axios from "axios";

//Take props to determine which single data to display
const Single = () => {
  const [authToken, setAuthToken] = useState(Cookies.get('token'));
  const { userId } = useParams();
  const [siteUser, setSiteUser] = useState({});
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    setAuthToken(Cookies.get('token'));
    const fetchSiteUser = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/users/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setSiteUser(response.data);
        setOrders(response.data.orders || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSiteUser();
  }, [userId]);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar user={user} />
        <div className="top">
          <div className="left">
            <div className="editBtn">Edit</div>
            <div className="title">Information</div>
            <div className="item">
              <img
                className="itemImg"
                src="https://randomuser.me/api/portraits/women/10.jpg"
                alt=""
              />
              <div className="details">
                <h1 className="itemTitle">{`${siteUser.firstName || "No Name"} ${siteUser.lastName || ""}`}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email</span>
                  <span className="itemValue">{siteUser.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone</span>
                  <span className="itemValue">{siteUser.phoneNumber}</span>
                </div>
                {siteUser.address && siteUser.address.home && (
                  <div className="detailItem">
                    <span className="itemKey">Home Address</span>
                    <span className="itemValue">{`${siteUser.address.home.name}, ${siteUser.address.home.address}, ${siteUser.address.home.state}, ${siteUser.address.home.phone}`}</span>
                  </div>
                )}
                <div className="detailItem">
                  <span className="itemKey">Country</span>
                  <span className="itemValue">{siteUser.country}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending (Last 6 months)" />
          </div>
        </div>
        <div className="bottom">
          <div className="title">Last Transactions</div>
          <List orders={orders} />
        </div>
      </div>
    </div>
  );
};

const List = ({ orders }) => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Title</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              {order.items.map((item, index) => (
                <tr key={index}>
                  {index === 0 && (
                    <td rowSpan={order.items.length}>{order.orderId}</td>
                  )}
                  <td>{item.productTitle}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.status}</td>
                  {index === 0 && (
                    <>
                      <td rowSpan={order.items.length}>{order.totalAmount}</td>
                      <td rowSpan={order.items.length}>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Single;
