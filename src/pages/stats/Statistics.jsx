import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/sidebar/Sidebar";
import Cookies from 'js-cookie'
import Navbar from "../../components/navbar/Navbar";
import './Statistics.scss'

const fetchData = async (period, date, month, year) => {
  const queryParams = new URLSearchParams({ period, date, month, year }).toString();
  try {
    const response = await axios.get(`http://127.0.0.1:4000/activities/aggregates?${queryParams}`,{
      headers:{Authorization:`Bearer ${Cookies.get('token')}`}
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {};
  }
};

const Statistics = ({ userData }) => {
  const [type, setType] = useState('Daily Stats');
  const [data, setData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const getData = async () => {
      let fetchedData;
      if (type === 'Daily Stats') {
        fetchedData = await fetchData('daily', selectedDate.toISOString().substr(0, 10));
      } else if (type === 'Weekly Stats') {
        fetchedData = await fetchData('weekly');
      } else if (type === 'Monthly Stats') {
        fetchedData = await fetchData('monthly', null, selectedMonth, selectedYear);
      }
      setData(fetchedData);
    };
    getData();
  }, [type, selectedDate, selectedMonth, selectedYear]);

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="statistics">
      <Sidebar />
      <div className="stats">
        <Navbar user={userData} />
        <div className="top">
          <div className="stats-btn-group">
            <button className="stats-btn" onClick={() => setType('Daily Stats')}>
              Daily Stats
            </button>
            <button className="stats-btn" onClick={() => setType('Weekly Stats')}>
              Weekly Stats
            </button>
            <button className="stats-btn" onClick={() => setType('Monthly Stats')}>
              Monthly Stats
            </button>
          </div>
          {type === 'Daily Stats' && (
            <input
              type="date"
              value={selectedDate.toISOString().substr(0, 10)}
              onChange={handleDateChange}
            />
          )}
          {type === 'Monthly Stats' && (
            <>
              <select value={selectedMonth} onChange={handleMonthChange}>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
              <select value={selectedYear} onChange={handleYearChange}>
                {[...Array(5)].map((_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                ))}
              </select>
            </>
          )}
        </div>
        <div className="dashboard">
          <div className="summary">
            <h2>{type} Summary</h2>
            {type === 'Daily Stats' && <p>Date: {selectedDate.toDateString()}</p>}
            {type === 'Monthly Stats' && <p>Month: {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>}
            <p>New Users: {data.newUsers}</p>
            <p>Orders: {data.orders}</p>
            <p>Logins: {data.logins}</p>
            <p>Visits: {data.visits}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
