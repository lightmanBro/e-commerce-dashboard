import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import "./listSalesData.scss";
import Receipt from "../receipt/Receipt";
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";

const SalesPage = () => {
  const {user,token} = useAuth();
  const [userData, setUserData] = useState(user);
  const [authToken, setToken] = useState(token);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(token);
    setUserData(user);
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:4000/products/all", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setItems(response.data);
        setFilteredItems(response.data); // Initialize filtered items with all items
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };

    fetchItems();
  }, []);

  const handleAddItem = (item) => {
    setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    setSearchTerm(""); // Clear search term after adding item
    setFilteredItems(items); // Reset filtered items
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedItems = selectedItems.map((item, idx) =>
      idx === index ? { ...item, quantity } : item
    );
    setSelectedItems(updatedItems);
    updateTotalPrice(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = selectedItems.filter((_, idx) => idx !== index);
    setSelectedItems(updatedItems);
    updateTotalPrice(updatedItems);
  };

  const updateTotalPrice = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleCompleteSale = async () => {
    try {
      // Prepare data for the POST request
      const salesperson = userData._id; // Replace with actual salesperson data
      const salesType = "shop"; // Assuming this is fixed for shop sales
      const totalAmount = totalPrice;
      const itemsSold = selectedItems.map((item) => ({
        product: item._id, // Assuming _id is the identifier for the product
        quantity: item.quantity,
        price: item.price,
      }));

      // Send POST request to record sale
      await axios.post("http://127.0.0.1:4000/sale/record", {
        salesperson,
        itemsSold,
        totalAmount,
        salesType,
      });

      // Update UI to show receipt
      setShowReceipt(true);
      alert("Sale completed successfully");
    } catch (error) {
      console.error("Error completing sale", error);
      alert("Failed to complete sale. Please try again.");
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const filtered = items.filter((item) =>
      item.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const numberInputStyle = {
    // Hide spinners in WebKit browsers (Chrome, Safari)
    WebkitAppearance: "none",
    margin: 0,
    // Hide spinners in Firefox
    MozAppearance: "textfield",
    // Hide spinners in Microsoft Edge
    msAppearance: "none",
  };

  return (
    <div className="salesPage">
      <Sidebar />
      <div className="top">
      <Navbar user={user}/>
        <div className="salesAction">
          <h1>Sales Page</h1>
          <div className="search">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {filteredItems.length > 0 && (
              <select
                onChange={(e) => handleAddItem(JSON.parse(e.target.value))}>
                {filteredItems.map((item) => (
                  <option key={item._id} value={JSON.stringify(item)}>
                    {item.productTitle} - ₦{item.price}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="selectedItems">
            <h2>Selected Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productTitle}</td>
                    <td>₦{item.price}</td>
                    <td>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          handleQuantityChange(index, parseInt(e.target.value))
                        }
                        style={numberInputStyle}
                      />
                    </td>
                    <td>₦{item.price * item.quantity}</td>
                    <td>
                      <button onClick={() => handleRemoveItem(index)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="summary">
            <h2>Summary</h2>
            <p>Total Price: ₦{totalPrice}</p>
            <button onClick={handleCompleteSale}>Complete Sale</button>
          </div>
          {showReceipt && (
            <div className="receiptContainer">
              <Receipt items={selectedItems} totalPrice={totalPrice} />
              <button onClick={handlePrintReceipt}>Print Receipt</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
