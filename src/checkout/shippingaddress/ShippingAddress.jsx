import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShippingAddress.scss";

const ShippingAddress = ({ onSelectAddress, onAddAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: "home",
    name: "",
    address: "",
    phone: "",
    state: "",
  });
  const [showAddNewAddressForm, setShowAddNewAddressForm] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:4000/user/addresses");
        setAddresses(Object.values(response.data.address));
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = async () => {
    try {
      const response = await axios.post("https://api.citratechsolar.com/user/address", {
        type: newAddress.type,
        details: newAddress,
      });
      setAddresses((prev) => [...prev, response.data.data]);
      onAddAddress(response.data.data);
      setNewAddress({
        type: "home",
        name: "",
        address: "",
        phone: "",
        state: "",
      });
      setShowAddNewAddressForm(false);
      setShowSuccessNotification(true);
      setTimeout(() => setShowSuccessNotification(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  const handleSelectAddress = (address, index) => {
    setSelectedAddressIndex(index);
    onSelectAddress(address);
  };

  return (
    <div className="shipping-address">
      <h2>Select Address</h2>
      {showSuccessNotification && (
        <div className="success-notification">
          Address added successfully!
        </div>
      )}
      <div className="address-list">
        {addresses.map(
          (addr, index) =>
            addr && (
              <div
                key={index}
                className={`address-item ${
                  selectedAddressIndex === index ? "selected" : ""
                }`}
                onClick={() => handleSelectAddress(addr, index)}>
                <div className="address-details">
                  <p>Name: {addr.name}</p>
                  <p>Address: {addr.address}</p>
                  <p>Phone: {addr.phone}</p>
                  <p>State: {addr.state}</p>
                </div>
                {selectedAddressIndex === index && (
                  <span className="check-mark">✔</span>
                )}
              </div>
            )
        )}
      </div>
      <button onClick={() => setShowAddNewAddressForm(!showAddNewAddressForm)}>
        {showAddNewAddressForm ? "Cancel" : "Add New Address"}
      </button>
      {showAddNewAddressForm && (
        <div className="new-address-form">
          <h3>Add New Address</h3>
          <select name="type" value={newAddress.type} onChange={handleChange}>
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="shipping">Shipping</option>
          </select>
          <br />
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={newAddress.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <label htmlFor="Address">Address</label>
          <input
            type="text"
            name="address"
            value={newAddress.address}
            onChange={handleChange}
            placeholder="Address"
          />
          <label htmlFor="Phone">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={newAddress.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
          <label htmlFor="State">State</label>
          <input
            type="text"
            name="state"
            value={newAddress.state}
            onChange={handleChange}
            placeholder="State"
          />
          <div className="addbtn">
            <button onClick={handleAddAddress}>Add Address</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
