import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
  { field: "customer", headerName: "Customer Name", width: 200 },
  { field: "address", headerName: "Address", width: 250 },
  { field: "deliveryTime", headerName: "Delivery Time", width: 200 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
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
  const {user,token} = useAuth();


  useEffect(() => {
    // Fetch delivery data from the server
    axios
      .get("http://127.0.0.1:4000/orders?status=shipped")
      .then((response) => {
        const deliveryData = response.data;
        if (deliveryData.length > 0) {
          setRows(deliveryData.map((order, index) => ({
            id: order._id,
            product: order.items.map(item => item.product.name).join(", "),
            image: order.items.map(item => item.product.image).join(", "),
            customer: order.customer.name,
            address: order.deliveryAddress,
            deliveryTime: new Date(order.deliveryTime).toLocaleString(),
            status: order.status,
          })));
        }
      })
      .catch((error) => {
        console.error("Error fetching delivery data:", error);
      });
  }, []);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (param) => {
        return (
          <div className="cellAction">
            <Link to={`/orders/${param.row.id}`}>
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
      <Navbar user={user}/>
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
