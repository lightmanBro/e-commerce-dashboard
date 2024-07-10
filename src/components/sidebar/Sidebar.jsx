import React from "react";
import {
  Dashboard as DashboardIcon,
  PersonOutlineOutlined as PersonOutlineOutlinedIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  Inventory2Outlined as Inventory2OutlinedIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  ListAltOutlined as ListAltOutlinedIcon,
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  LogoutOutlined as LogoutOutlinedIcon,
  MonetizationOnOutlined as MonetizationOnOutlinedIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path as necessary
import "./Sidebar.scss";

const Sidebar = ({active}) => {
  const { logoutUser,token,user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Clear user data from context and localStorage
    navigate("/login"); // Redirect to login page
  };

  if (!user) {
    return null; // Avoid rendering Sidebar if user is not authenticated
  }

  const renderMenuItems = () => {
    switch (user.role) {
      case "admin":
        return (
          <>
            <li>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <PersonOutlineOutlinedIcon className="icon" />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ textDecoration: "none" }}>
                <Inventory2OutlinedIcon className="icon" />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlinedIcon className="icon" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/sales" style={{ textDecoration: "none" }}>
                <MonetizationOnOutlinedIcon className="icon" />
                <span>Sales</span>
              </Link>
            </li>
            <li>
              <Link to="/delivery" style={{ textDecoration: "none" }}>
                <LocalShippingOutlinedIcon className="icon" />
                <span>Delivery</span>
              </Link>
            </li>
            <li>
              <Link to="/statistics" style={{ textDecoration: "none" }}>
                <BarChartOutlinedIcon className="icon" />
                <span>Stats</span>
              </Link>
            </li>
            <li>
              <NotificationsOutlinedIcon className="icon" />
              <span>Notification</span>
            </li>
            <li>
              <ListAltOutlinedIcon className="icon" />
              <span>Logs</span>
            </li>
          </>
        );
      case "support":
        return (
          <>
            <li>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <PersonOutlineOutlinedIcon className="icon" />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link to="/products" style={{ textDecoration: "none" }}>
                <Inventory2OutlinedIcon className="icon" />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to="/orders" style={{ textDecoration: "none" }}>
                <ShoppingCartOutlinedIcon className="icon" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/sales" style={{ textDecoration: "none" }}>
                <MonetizationOnOutlinedIcon className="icon" />
                <span>Sales</span>
              </Link>
            </li>
            <li>
              <Link to="/delivery" style={{ textDecoration: "none" }}>
                <LocalShippingOutlinedIcon className="icon" />
                <span>Delivery</span>
              </Link>
            </li>
            <li>
              <NotificationsOutlinedIcon className="icon" />
              <span>Notification</span>
            </li>
            <li>
              <ListAltOutlinedIcon className="icon" />
              <span>Logs</span>
            </li>
          </>
        );
      case "sales":
        return (
          <>
            <li>
              <Link to="/products" style={{ textDecoration: "none" }}>
                <Inventory2OutlinedIcon className="icon" />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to="/sales" style={{ textDecoration: "none" }}>
                <MonetizationOnOutlinedIcon className="icon" />
                <span>Sales</span>
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Citratech</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          {user.role === "admin" && (
            <li>
              <Link to="/" style={{ textDecoration: "none" }}>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </Link>
            </li>
          )}
          <p className="title">LIST</p>
          {renderMenuItems()}
          <p className="title">USER</p>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profile</span>
            </li>
          </Link>
          <li onClick={handleLogout}>
            <LogoutOutlinedIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption"></div>
        <div className="colorOption"></div>
      </div>
    </div>
  );
};

export default Sidebar;
