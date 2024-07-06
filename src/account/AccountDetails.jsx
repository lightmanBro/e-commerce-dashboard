import React from "react";
import UserData from "./userdata/UserData";
import UpdateDetails from "./userdetails/UpdateDetails";
import ChangePassword from "./changepassword/ChangePassword";
import "./AccountDetails.scss";
import Address from "./address/Address";
import OrderHistory from "./order/OrderHistory";

const AccountDetails = () => {
  return (
    <div className="account-details">
      <h2>Account Details</h2>
      <UserData />
      <UpdateDetails />
      <ChangePassword />
      <Address/>
      <OrderHistory/>
    </div>
  );
};

export default AccountDetails;
