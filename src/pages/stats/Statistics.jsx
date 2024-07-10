import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Widget from "../../components/widget/Widget";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Chart from "../../components/chart/Chart";

import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUpOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Link } from "react-router-dom";
import "./Statistics.scss";

const initialSummaryState = {
  newUsers: 0,
  orders: 0,
  visits: 0,
  logins: 0,
};

const Statistics = () => {
  const [type, setType] = useState("Monthly Stats"); // Default to Monthly Stats
  const [data, setData] = useState({
    dailySummary: { ...initialSummaryState },
    weeklySummary: { ...initialSummaryState },
    monthlySummary: { ...initialSummaryState },
  });
  const navigate = useNavigate();
  const {user,token}= useAuth();
  useEffect(() => {
    const fetchData = async (period) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:4000/activities/aggregates?period=${period}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData((prevData) => ({
          ...prevData,
          [`${period}Summary`]: response.data.data,
        }));
        console.log(response.data.data);
      } catch (error) {
        console.error(`Error fetching ${period} data:`, error);
      }
    };

    fetchData("daily");
    fetchData("weekly");
    fetchData("monthly");
  }, [token, user, navigate]);

  const prepareChartData = (summary, key) => {
    return [{ name: key, Total: summary[key] }];
  };

  const setStatsType = (e) => {
    setType(e.target.innerText);
  };

  const renderWidgetsAndCharts = (summary, period) => {
    return (
      <>
        <div className="widget-chart-container">
          <Widget type="user" amount={summary.newUsers} difference={10} />
          <Chart
            aspect={2 / 1}
            title={`${period} New Users (Last 6 months)`}
            data={prepareChartData(summary, "newUsers")}
          />
        </div>
        <div className="widget-chart-container">
          <Widget type="order" amount={summary.orders} difference={15} />
          <Chart
            aspect={5 / 10}
            title={`${period} Orders (Last 6 months)`}
            data={prepareChartData(summary, "orders")}
          />
        </div>
        <div className="widget-chart-container">
          <Widget type="login" amount={summary.logins} difference={20} />
          <Chart
            aspect={2 / 1}
            title={`${period} Logins (Last 6 months)`}
            data={prepareChartData(summary, "logins")}
          />
        </div>
      </>
    );
  };

  return (
    <div className="statistics">
      <Sidebar />
      <div className="stats">
        <Navbar user={user} />
        <div className="top">
          <div className="stats-btn-group">
            <div className="stats-btn" onClick={setStatsType}>
              Daily Stats
            </div>
            <div className="stats-btn" onClick={setStatsType}>
              Weekly Stats
            </div>
            <div className="stats-btn" onClick={setStatsType}>
              Monthly Stats
            </div>
          </div>
        </div>
        <div className="dashboard">
          {type === "Daily Stats" &&
            renderWidgetsAndCharts(data.dailySummary, "Daily")}
          {type === "Weekly Stats" &&
            renderWidgetsAndCharts(data.weeklySummary, "Weekly")}
          {type === "Monthly Stats" &&
            renderWidgetsAndCharts(data.monthlySummary, "Monthly")}
        </div>
      </div>
    </div>
  );
};

const Widget = ({ type, amount, difference }) => {
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        url: "/users",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "rgba(255,0,0,0.2)" }}
          />
        ),
      };
      break;
    case "price":
      data = {
        title: "TOTAL",
        isMoney: true,
        link: "View all orders",
        url: "/orders",
        icon: (
          <MonetizationOutlinedIcon
            className="icon"
            style={{ color: "green", backgroundColor: "rgba(0,128,0,0.2)" }}
          />
        ),
      };
      break;
    case "earnings":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        url: "https://payaza.africa/login/",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{ color: "purple", backgroundColor: "rgba(128,0,128,0.2)" }}
          />
        ),
      };
      break;
    case "products":
      data = {
        title: "PRODUCTS",
        isMoney: false,
        link: "View all products",
        url: "/products",
        icon: (
          <StorefrontIcon
            className="icon"
            style={{ color: "green", backgroundColor: "rgba(0,128,0,0.2)" }}
          />
        ),
      };
      break;
    case "availableProducts":
      data = {
        title: "AVAILABLE PRODUCTS",
        isMoney: false,
        icon: <InventoryIcon className="icon inv-available" />,
      };
      break;
    case "stock":
      data = {
        title: "TOTAL STOCK",
        isMoney: false,
        link: "View stock details",
        url: "/stock",
        icon: <InventoryIcon className="icon inv-total" />,
      };
      break;
    case "orders":
      data = {
        title: "TOTAL ORDERS",
        isMoney: false,
        link: "View all orders",
        url: "/orders",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218,165,32,0.2)",
            }}
          />
        ),
      };
      break;
    default:
      data = {
        title: "N/A",
        isMoney: false,
        link: "N/A",
        url: "",
        icon: null,
      };
      break;
  }

  return (
    <div className="widget" style={{ height: "fit-content" }}>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "₦"} {amount}
        </span>
        {data.link !== "N/A" && (
          <Link to={data.url} className="link">
            {data.link}
          </Link>
        )}
      </div>
      <div className="right">
        {difference !== undefined && (
          <div
            className={`percentage ${
              difference >= 0 ? "positive" : "negative"
            }`}>
            <KeyboardArrowUp />
            {difference}%
          </div>
        )}
        {data.icon}
      </div>
    </div>
  );
};

export default Statistics;
