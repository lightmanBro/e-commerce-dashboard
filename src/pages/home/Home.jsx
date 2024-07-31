import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import "./Home.scss";
import "../../components/widget/Widget.scss";
import Widget from "../../components/widget/Widget";
import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/feature/Featured";
import Chart from "../../components/chart/Chart";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";
import Cookies from 'js-cookie';

const Home = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [lastWeekRevenue, setLastWeekRevenue] = useState(0);
  const [salesPercentage, setSalesPercentage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = Cookies.get('token');
    console.log(user);
    if (token) {
      setToken(token);
      setUser(user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const salesResponse = await axios.get("https://api.citratechsolar.com/sales/all", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const summaryResponse = await axios.get("https://api.citratechsolar.com/summary", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setSalesData(salesResponse.data.data);
          console.log(salesResponse.data.data,summaryResponse.data.data);
          setSummaryData(summaryResponse.data);

          const total = salesResponse.data.data.reduce(
            (acc, sale) => acc + sale.price * sale.unit,
            0
          );
          setTotalAmount(total);

          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          const lastWeekSales = salesResponse.data.data.filter(
            (sale) => new Date(sale.createdAt) >= lastWeek
          );
          const lastWeekTotal = lastWeekSales.reduce(
            (acc, sale) => acc + sale.price * sale.unit,
            0
          );
          setLastWeekRevenue(lastWeekTotal);

          if (summaryResponse.data.availableTotalPrice > 0) {
            const percentage = (total / summaryResponse.data.availableTotalPrice) * 100;
            setSalesPercentage(percentage);
          }
        } catch (error) {
          console.error("Error fetching data", error);
        }
      }
    };

    fetchData();
  }, [token]);

  if (!user || !token) {
    return <div>Loading...</div>;
  }

  const renderWidgets = () => {
    if (!user) return null;

    const { role } = user;

    if (role === "admin") {
      return (
        <>
          <Widget type="user" userCount={summaryData.usersCount} />
          <Widget type="price" availableTotalPrice={summaryData.availableTotalPrice} />
          <Widget type="earnings" totalEarnings={totalAmount} />
          <Widget type="products" count={summaryData.totalProducts} />
          <Widget type="availableProducts" count={summaryData.availableProducts} />
          <Widget type="stock" count={summaryData.totalStock} />
          <Widget type="orders" count={summaryData.totalOrders} />
        </>
      );
    } else if (role === "support") {
      return (
        <>
          <Widget type="products" count={summaryData.totalProducts} />
          <Widget type="availableProducts" count={summaryData.availableProducts} />
          <Widget type="stock" count={summaryData.totalStock} />
          <Widget type="orders" count={summaryData.totalOrders} />
        </>
      );
    } else if (role === "sales") {
      return (
        <>
          <Widget type="products" count={summaryData.totalProducts} />
          <Widget type="availableProducts" count={summaryData.availableProducts} />
          <Widget type="stock" count={summaryData.totalStock} />
        </>
      );
    }
    return null;
  };

  const renderCharts = () => {
    if (user.role === "admin" || user.role === "sales" || user.role === "support") {
      return (
        <div className="charts">
          <Featured
            title={"Revenue"}
            totalamount={totalAmount}
            resultamount={lastWeekRevenue}
            desc="Last one week revenue"
            salespercentage={salesPercentage}
          />
          <Chart aspect={2 / 1} title="Last 6 months (Revenue)" data={totalAmount} />
        </div>
      );
    }
    return null;
  };

  const renderSalesTable = () => {
    if (user.role === "admin" || user.role === "sales" || user.role === "support") {
      return (
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <SalesTable salesData={salesData} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="home">
      <Sidebar active={"dashboard"} />
      <div className="homeContainer">
        <Navbar user={user} />
        <div className="widgets">{renderWidgets()}</div>
        {renderCharts()}
        {renderSalesTable()}
      </div>
    </div>
  );
};

const SalesTable = ({ salesData }) => {
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="sales table">
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Sales Type</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salesData.map((sale) => (
            <TableRow key={sale._id}>
              <TableCell>{sale.productId.findId}</TableCell>
              <TableCell>{sale.productId.productTitle}</TableCell>
              <TableCell>{sale.unit}</TableCell>
              <TableCell>₦{sale.price}</TableCell>
              <TableCell>{sale.salesType}</TableCell>
              <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Home;
