import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from 'js-cookie';
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";
import "../orderDataTable/listOrderTable.scss";

const columns = [
  { field: "id", headerName: "Order ID", width: 100 },
  {
    field: "product",
    headerName: "Product",
    width: 200,
    renderCell: (param) => {
      return (
        <div className="cellWithImg">
          <img src={param.row.image} alt="" className="cellImg" />
          {param.row.product}
        </div>
      );
    },
  },
  { field: "customer", headerName: "Customer Name", width: 150 },
  { field: "paymentType", headerName: "Payment type", width: 50 },
  { field: "deliveryTime", headerName: "Delivery Time", width: 200 },
  { field: "totalAmount", headerName: "Amount", width: 100 },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (param) => {
      return (
        <div className={`cellWithStatus ${param.row.status.toLowerCase()}`}>
          {param.row.status}
        </div>
      );
    },
  },
];

const fallbackRows = [
  {
    id: 1,
    product: "Wireless Headphones",
    image: "https://example.com/images/wireless-headphones.jpg",
    customer: "John Doe",
    address: "1234 Elm St, Springfield, IL",
    deliveryTime: "2024-06-01 10:00 AM",
    status: "Shipped",
  },
  {
    id: 2,
    product: "Smartphone",
    image: "https://example.com/images/smartphone.jpg",
    customer: "Jane Smith",
    address: "5678 Oak St, Metropolis, NY",
    deliveryTime: "2024-06-02 02:00 PM",
    status: "Shipped",
  },
  {
    id: 3,
    product: "Laptop",
    image: "https://example.com/images/laptop.jpg",
    customer: "Bob Johnson",
    address: "9101 Pine St, Gotham, NJ",
    deliveryTime: "2024-06-03 12:00 PM",
    status: "Shipped",
  },
  {
    id: 4,
    product: "Bluetooth Speaker",
    image: "https://example.com/images/bluetooth-speaker.jpg",
    customer: "Alice Davis",
    address: "1112 Cedar St, Star City, FL",
    deliveryTime: "2024-06-04 09:00 AM",
    status: "Shipped",
  },
  {
    id: 5,
    product: "Smartwatch",
    image: "https://example.com/images/smartwatch.jpg",
    customer: "Charlie Brown",
    address: "1314 Maple St, Central City, CA",
    deliveryTime: "2024-06-05 04:00 PM",
    status: "Shipped",
  },
];

const Delivery = () => { 
  const [rows, setRows] = useState(fallbackRows);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = Cookies.get('token');

    if (token) {
      setAuthToken(token);
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDelivery = async () => {
      if (authToken) {
        try {
          const response = await axios.get("https://api.citratechsolar.com/orders/shipped", {
            headers: { Authorization: `Bearer ${authToken}` },
          });

          const { shippedOrders } = response.data;
          console.log(shippedOrders)
          setRows(
            shippedOrders.map((order) => ({
              id: order.orderId,
              product: order.items.map((item) => item.productId.productTitle).join(", "),
              image: order.items.map((item) => `http://127.0.0.1:4000/item-media-files/${item.productId.mediaFilesPicture[0]}`),
              customer: `${order.customer.firstName} ${order.customer.lastName}`,
              paymentType: order.paymentType,
              deliveryTime: new Date(order.deliveryDate).toLocaleString(),
              totalAmount: order.totalAmount,
              status: order.status,
            }))
          );
        } catch (error) {
          console.error("Error fetching delivery data:", error.message);
        }
      }
    };

    fetchDelivery();
  }, [authToken]);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (param) => {
        return (
          <div className="cellAction">
            <Link to={`/orders/${param.row._id}`}>
              <div className="viewBtn">View</div>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="listOrderTable">
      <Sidebar />
      <div className="dataTable">
        <Navbar user={user} />
        <h1>Delivery List</h1>
        <div className="orderTable">
          <DataGrid
            className="dataGrid"
            rows={rows}
            columns={columns.concat(actionColumn)}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      </div>
    </div>
  );
};

export default Delivery;
