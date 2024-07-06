import React from "react";
import "./Widget.scss";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUpOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Link } from "react-router-dom";

const Widget = ({ type, totalEarnings, userCount, count, availableTotalPrice, difference }) => {
  console.log(type, totalEarnings, userCount, count, availableTotalPrice, difference)
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        url: "/users",
        amount: userCount,
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
        amount: availableTotalPrice,
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
        amount: totalEarnings,
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
        amount: count,
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
        amount: count,
        icon: <InventoryIcon className="icon inv-available" />
      };
      break;
    case "stock":
      data = {
        title: "TOTAL STOCK",
        isMoney: false,
        link: "View stock details",
        url: "/stock",
        amount: count,
        icon: <InventoryIcon className="icon inv-total" />
      };
      break;
    case "orders":
      data = {
        title: "TOTAL ORDERS",
        isMoney: false,
        link: "View all orders",
        url: "/orders",
        amount: count,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{ color: "goldenrod", backgroundColor: "rgba(218,165,32,0.2)" }}
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
        amount: 0,
        icon: null,
      };
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "₦"} {data.amount}
        </span>
        {data.link !== "N/A" && <Link to={data.url} className="link">{data.link}</Link>}
      </div>
      <div className="right">
        {difference !== undefined && (
          <div className={`percentage ${difference >= 0 ? 'positive' : 'negative'}`}>
            <KeyboardArrowUp />
            {difference}%
          </div>
        )}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
