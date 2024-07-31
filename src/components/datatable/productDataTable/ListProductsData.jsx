import { Link } from "react-router-dom";
import axios from "axios";
import "./ListProductData.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import Cookies from 'js-cookie'; // Import js-cookie for cookie handling
import { useNavigate } from "react-router-dom";
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";

const columns = [
  { field: "findId", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Product Name",
    width: 230,
    renderCell: (param) => {
      return (
        <div className="cellWithImg">
          <img src={param.row.image.toString()} alt="" className="cellImg" />
          {param.row.name}
        </div>
      );
    },
  },
  { field: "category", headerName: "Category", width: 130 },
  { field: "price", headerName: "Price", type: "number", width: 130 },
  {
    field: "stock",
    headerName: "Stock",
    type: "number",
    width: 90,
    renderCell: (param) => {
      return (
        <div
          className={`cellWithStock ${
            param.row.stock === 0 ? "outOfStock" : ""
          }`}>
          {param.row.stock === 0 ? "Out of Stock" : param.row.stock}
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (param) => {
      return (
        <div className={`cellWithStatus ${param.row.status.toLowerCase()}`}>
          {param.row.status}
        </div>
      );
    },
  },
];

const ListProductDatatable = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user'))); // Get user from local storage
  const [authToken, setAuthToken] = useState(Cookies.get('token')); // Get token from cookies
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken(Cookies.get('token')); // Update token from cookies
    setUserData(JSON.parse(localStorage.getItem('user'))); // Update user data from local storage
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      try {
        if (!authToken) {
          navigate("/login"); // Redirect if no token is found
          return;
        }

        const response = await axios.get("https://api.citratechsolar.com/products/all", {
          signal,
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const transformedData = response.data.map((item) => ({
          id: item._id,
          findId: item.findId,
          name: item.productTitle,
          category: item.category || "uncategorized",
          price: item.price,
          stock: item.stock,
          status: item.status,
          image:
            item.mediaFilesPicture.length > 0
              ? `https://api.citratechsolar.com/item-media-files/${item.mediaFilesPicture[0]}`
              : "default-image-url",
        }));

        setRows(transformedData);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          setError(err.message);
          console.error("Error fetching products:", err);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [authToken, navigate]);

  const handleDeleteClick = (id) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    console.log(deleteProductId);
    try {
      const response = await axios.delete(
        `https://api.citratechsolar.com/product/${deleteProductId}`, 
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(response.data);
      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== deleteProductId)
      );
      setShowDeleteModal(false);
      alert("Product deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product. Please try again.");
    }
  };
  

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteProductId(null);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (param) => {
        return (
          <div className="cellAction">
            <Link to={`/products/${param.row.id}`}>
              <div className="viewBtn">View</div>
            </Link>
            <div
              className="deleteBtn"
              onClick={() => handleDeleteClick(param.row.id)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="productdatatable">
      <Sidebar />
      <div className="productdataTableTitle">
        <Navbar user={userData} />
        <div className="add">
          Add New Product
          <Link to="/products/new" className="link">
            New Product
          </Link>
        </div>
        {error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <DataGrid
            className="dataGrid"
            rows={rows}
            columns={columns.concat(actionColumn)}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={handleDeleteCancel}
        className="modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this product?</p>
        <div className="delete-modal-btns">
          <button className="yes" onClick={handleDeleteConfirm}>
            Yes
          </button>
          <button className="no" onClick={handleDeleteCancel}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ListProductDatatable;
