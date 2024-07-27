import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Address.scss";

const Address = () => {
  const [addresses, setAddresses] = useState({});
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    type: "",
    name: "",
    address: "",
    phone: "",
    state: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("https://api.citratechsolar.com/user/addresses");
        setAddresses(response.data.address);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const handleEditAddress = (type, details) => {
    setEditingAddress(type);
    setAddressForm({ type, ...details });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAddress = async () => {
    try {
      const response = await axios.post("https://api.citratechsolar.com/user/address", {
        type: addressForm.type,
        details: addressForm,
      });
      setAddresses((prev) => ({ ...prev, [addressForm.type]: response.data.data }));
      setEditingAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  return (
    <div className="address-container">
      <h2>Addresses</h2>
      <div className="address-list">
        {Object.keys(addresses).map((type) => (
          <div key={type} className="address-item">
            {editingAddress === type ? (
              <div className="edit-address-form">
                <input
                  type="text"
                  name="name"
                  value={addressForm.name}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <input
                  type="text"
                  name="address"
                  value={addressForm.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
                <input
                  type="text"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
                <input
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={handleChange}
                  placeholder="State"
                />
                <button className="btn-save" onClick={handleSaveAddress}>Save</button>
                <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div className="address-details">
                <p><strong>Type:</strong> {addresses[type]?.type}</p>
                <p><strong>Name:</strong> {addresses[type]?.name}</p>
                <p><strong>Address:</strong> {addresses[type]?.address}</p>
                <p><strong>Phone:</strong> {addresses[type]?.phone}</p>
                <p><strong>State:</strong> {addresses[type]?.state}</p>
                <button className="btn-edit" onClick={() => handleEditAddress(type, addresses[type])}>
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;
