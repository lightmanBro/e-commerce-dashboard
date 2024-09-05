import React, { useState } from "react";
import "./PaymentSearch.scss";

const PaymentSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("payer_name");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      onSearch({ query, searchBy });
    }
  };

  return (
    <div className="payment-search">
      <form onSubmit={handleSearch}>
        <div className="search-fields">
          <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
            <option value="payer_name">Payer Name</option>
            <option value="customerReference">Customer Reference</option>
            <option value="citratechReference">Citratech Reference</option>
            <option value="rrn">RRN</option>
            <option value="source_bank_name">Source Bank Name</option>
            <option value="status">Status</option>
          </select>
          <input
            type="text"
            placeholder="Enter your search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default PaymentSearch;
