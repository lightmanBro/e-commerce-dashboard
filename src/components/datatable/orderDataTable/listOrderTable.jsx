import React, { useEffect, useState } from 'react';
import '../orderDataTable/listOrderTable.scss';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from '../../sidebar/Sidebar';
import Navbar from '../../navbar/Navbar';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Orders = () => {
  const {token,user} = useAuth();
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState(user);
  const [authToken, setToken] = useState(token);
  const navigate = useNavigate();
  console.log(token)
  useEffect(() => {
    setToken(token);
    setUserData(user);
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:4000/orders/list',{
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data.orders);
        if(response.data.orders.length > 0){
          setOrders(response.data.orders.map(order=>({
            id:order.orderId,
            _id:order._id,
            customerId:order.customer._id,
            customer:`${order.customer.firstName ? order.customer.firstName :""} ${order.customer.lastname ? order.customer.lastname:""}`,
            email:order.customer.email,
            orderDate: new Date(order.orderDate).toLocaleDateString(),
            totalAmount:order.totalAmount,
            items:order.items.length
          })))
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { field: 'id', headerName: 'Order ID', width: 150 },
    { field: 'items', headerName: 'Item(s)', width: 150 },
    {
      field: 'customer',
      headerName: 'Customer',
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/users/${params.row.customerId}`}>
           { params.row.customer}
          </Link>
        </div>
      ),
    },
    { field: 'email', headerName: 'Customer mail', width: 150 },
    {
      field: 'orderDate',
      headerName: 'Order Date',
      width: 200,
      type: 'Date',
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      width: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/orders/${params.row._id}`}>
            <div className="viewBtn">View</div>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="listOrderTable">
      <Sidebar />
      <div className="dataTable">
      <Navbar user={user}/>
        <h1>Order Lists</h1>
        <div className="orderTable">
          <DataGrid
            className="dataGrid"
            rows={orders}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row._id}
            checkboxSelection
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
