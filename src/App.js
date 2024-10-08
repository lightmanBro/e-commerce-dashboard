import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./style/dark.scss";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { productsInputsm, userInputs } from "./formSource";
import Product from "./pages/single/product/Product";
import OrderProcessingPage from "./pages/single/order/Order";
import Orders from "./components/datatable/orderDataTable/listOrderTable";
import ListProductDatatable from "./components/datatable/productDataTable/ListProductsData";
import Statistics from "./pages/stats/Statistics";
import Profile from "./pages/profile/Profile";
import Sales from "./components/datatable/salesDataTable/listSalesData";
import Delivery from "./components/datatable/deliveryDataTable/listDeliveryData";
import Auth from "./pages/login/login";
import ResetPassword from "./pages/login/forgotPassword";
// import { DarkModeContext } from "./context/darkModeContext";
import Receipt from "./components/datatable/receipt/Receipt";
import Payment from "./pages/payments/Payment";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Auth />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/payments" element={<Payment/>}/>
          <Route path="/delivery" element={<Delivery />} />
          <Route path="users">
            <Route index element={<List />} />
            <Route path=":userId" element={<Single />} />
            <Route
              path="new"
              element={<New inputs={userInputs} title="Add new User" />}
            />
          </Route>
          <Route path="products">
            <Route index element={<ListProductDatatable />} />
            <Route path=":productId" element={<Product />} />
            <Route
              path="new"
              element={<New inputs={productsInputsm} title="Add new Product" />}
            />
          </Route>
          <Route path="orders">
            <Route index element={<Orders />} />
            <Route path=":orderId" element={<OrderProcessingPage />} />
          </Route>
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/receipt" element={<Receipt/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
