import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from 'js-cookie';
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
  { field: "lastLogin", headerName: "Last Login", type: "date", width: 190 },
];

const Datatable = () => {
  const [userData, setUserData] = useState(null);
  const [authToken, setToken] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = Cookies.get('token');

    if (token) {
      setToken(token);
      setUserData(user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (authToken) {
        try {
          const response = await axios.get("http://127.0.0.1:4000/users/all", {
            headers: { Authorization: `Bearer ${authToken}` },
          });

          const formattedRows = response.data.map((user) => ({
            id: user._id,
            firstName: user.firstName,
            email: user.email,
            role: user.role,
            lastLogin: new Date(user.lastLoginDate).toLocaleDateString() || "yet to"
          }));

          setRows(formattedRows);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching users:", error);
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [authToken]);

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
        <p>Loading...</p>
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
