import React, { useEffect, useState } from 'react';
import '../orderDataTable/listOrderTable.scss';
import { useNavigate } from "react-router-dom";
import Sidebar from '../../sidebar/Sidebar';
import Navbar from '../../navbar/Navbar';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie for cookie handling

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [authToken, setAuthToken] = useState(Cookies.get('token')); // Get token from cookies
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user'))); // Get user from local storage
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken(Cookies.get('token')); // Update token from cookies
    setUserData(JSON.parse(localStorage.getItem('user'))); // Update user data from local storage
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!authToken) {
          navigate("/login"); // Redirect if no token is found
          return;
        }

        const response = await axios.get('https://api.citratechsolar.com/orders/list', {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const formattedOrders = response.data.orders.map(order => ({
          id: order.orderId,
          _id: order._id,
          customerId: order.customer._id,
          customer: `${order.customer.firstName || ""} ${order.customer.lastName || ""}`,
          email: order.customer.email,
          status:order.status,
          orderDate: new Date(order.orderDate), // Use Date object
          totalAmount: order.totalAmount,
          items: order.items.length,
        }));
        console.log(response.data)
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          navigate("/login"); // Redirect to login on unauthorized access
        }
      }
    };

    fetchOrders();
  }, [authToken, navigate]);

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
            {params.row.customer}
          </Link>
        </div>
      ),
    },
    { field: 'email', headerName: 'Customer Mail', width: 150 },
    {field:'status',headerName:'Order Status',width:150},
    {
      field: 'orderDate',
      headerName: 'Order Date',
      width: 200,
      type: 'date',
      valueGetter: (params) => params // Ensure Date object is used
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
        <Navbar user={userData} />
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
