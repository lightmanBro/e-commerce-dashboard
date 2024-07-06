import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import "./Datatable.scss"; // Assuming you have defined your styles here

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "firstName",
    headerName: "Name",
    width: 230,
    renderCell: (param) => (
      <div className="cellWithImg">
        <img src={param.row.image} alt="" className="cellImg" />
        {param.row.firstName}
      </div>
    ),
  },
  { field: "email", headerName: "User Email", width: 230 },
  { field: "role", headerName: "User Role", width: 230 },
  { field: "lastLogin", headerName: "Last Login", type: "Date", width: 190 },
];

const Datatable = () => {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState(user);
  const [authToken, setToken] = useState(token);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    setToken(token);
    setUserData(user);
    if (!userData || !authToken) {
      navigate("/login"); // Redirect to login if no user is found
    }
  }, [userData, authToken, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:4000/users/all",{headers: { Authorization: `Bearer ${token}` }});
        const formattedRows= response.data.map((user)=>({
          id:user._id,
          firstName:user.firstName,
          email:user.email,
          role:user.role,
          lastLogin:new Date(user.lastLoginDate).toLocaleDateString() || "yet to"
        }))
        console.log(response.data,formattedRows)
        setRows(formattedRows);
        setLoading(false); // Turn off loading indicator
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Ensure loading indicator is turned off on error
      }
    };

    fetchUsers();
  }, []);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (param) => (
        <div className="cellAction">
          <Link to={`/users/${param.row.id}`}>
            <div className="viewBtn">View</div>
          </Link>
          {/* Implement delete functionality */}
          <div
            className="deleteBtn"
            onClick={() => {
              console.log(param.row.id);
              // Implement delete logic here
            }}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="dataTableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p> // Show loading indicator while fetching data
      ) : (
        <DataGrid
          className="dataGrid"
          rows={rows}
          columns={columns.concat(actionColumn)}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      )}
    </div>
  );
};

export default Datatable;
