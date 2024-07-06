import "../table/table.scss";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useState } from "react";

const rows = [
  {
    id: 1,
    product: "Wireless Headphones",
    image: "https://example.com/images/wireless-headphones.jpg",
    customer: "John Doe",
    date: "2024-06-01",
    amount: 99.99,
    method: "Credit Card",
    status: "Shipped",
  },
  {
    id: 2,
    product: "Smartphone",
    image: "https://example.com/images/smartphone.jpg",
    customer: "Jane Smith",
    date: "2024-06-02",
    amount: 699.99,
    method: "PayPal",
    status: "Delivered",
  },
  {
    id: 3,
    product: "Laptop",
    image: "https://example.com/images/laptop.jpg",
    customer: "Bob Johnson",
    date: "2024-06-03",
    amount: 1299.99,
    method: "Credit Card",
    status: "Processing",
  },
  {
    id: 4,
    product: "Bluetooth Speaker",
    image: "https://example.com/images/bluetooth-speaker.jpg",
    customer: "Alice Davis",
    date: "2024-06-04",
    amount: 49.99,
    method: "Debit Card",
    status: "Cancelled",
  },
  {
    id: 5,
    product: "Smartwatch",
    image: "https://example.com/images/smartwatch.jpg",
    customer: "Charlie Brown",
    date: "2024-06-05",
    amount: 199.99,
    method: "Credit Card",
    status: "Shipped",
  },
  {
    id: 6,
    product: "Tablet",
    image: "https://example.com/images/tablet.jpg",
    customer: "David Wilson",
    date: "2024-06-06",
    amount: 399.99,
    method: "PayPal",
    status: "Delivered",
  },
  {
    id: 7,
    product: "Camera",
    image: "https://example.com/images/camera.jpg",
    customer: "Eve Taylor",
    date: "2024-06-07",
    amount: 549.99,
    method: "Credit Card",
    status: "Processing",
  },
  {
    id: 8,
    product: "Gaming Console",
    image: "https://example.com/images/gaming-console.jpg",
    customer: "Frank Harris",
    date: "2024-06-08",
    amount: 299.99,
    method: "Debit Card",
    status: "Cancelled",
  },
  {
    id: 9,
    product: "Monitor",
    image: "https://example.com/images/monitor.jpg",
    customer: "Grace Lewis",
    date: "2024-06-09",
    amount: 199.99,
    method: "Credit Card",
    status: "Shipped",
  },
  {
    id: 10,
    product: "Keyboard",
    image: "https://example.com/images/keyboard.jpg",
    customer: "Henry Walker",
    date: "2024-06-10",
    amount: 49.99,
    method: "PayPal",
    status: "Delivered",
  },
];
//Will take prop
//fetch data from db and populate the table with the data
//Add a view button to display more details about the order
const List = () => {
  const [data, setData] = useState([]);
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell" align="right">
              Tracking ID
            </TableCell>
            <TableCell className="tableCell" align="right">
              Product
            </TableCell>
            <TableCell className="tableCell" align="right">
              Customer
            </TableCell>
            <TableCell className="tableCell" align="right">
              Date
            </TableCell>
            <TableCell className="tableCell" align="right">
              Amount
            </TableCell>
            <TableCell className="tableCell" align="right">
              Payment Method
            </TableCell>
            <TableCell className="tableCell" align="right">
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell" align="right">
                {row.id}
              </TableCell>
              <TableCell className="tableCell" align="right">
                <div className="cellWrapper">
                  <img src={row.image} alt="" />
                  {row.product}
                </div>
              </TableCell>
              <TableCell className="tableCell" align="right">
                {row.customer}
              </TableCell>
              <TableCell className="tableCell" align="right">
                {row.date}
              </TableCell>
              <TableCell className="tableCell" align="right">
                {row.amount}
              </TableCell>
              <TableCell className="tableCell" align="right">
                {row.method}
              </TableCell>
              <TableCell className="tableCell" align="right">
                <span className={`status ${row.status.toLowerCase()}`}>
                  {row.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
