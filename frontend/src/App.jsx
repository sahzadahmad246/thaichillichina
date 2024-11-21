import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Pages/Home";
import Menu from "./components/Pages/Menu";
import Cart from "./components/Pages/Cart";
import Account from "./components/Pages/Account";
import Search from "./components/Header/Search";
import ProductDetails from "./components/Product/ProductDetails";
import LoginRegisterForm from "./components/User/LoginRegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./actions/userAction";
import store from "./store";
import Profile from "./Account/Profile";
import Orders from "./Account/Orders";
import Address from "./Account/Address";

import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Shipping from "./components/User/Shipping";
import ProtectedRoute from "./components/User/ProtectedRoute";
import ConfirmOrder from "./components/User/ConfirmOrder";
import PaymentSuccess from "./components/User/PaymentSuccess";
import OrderDetails from "./Account/OrderDetails";
import Layout from "./Layout";
import AdminOrders from "./Admin/AdminOrders";
import AdminMenu from "./Admin/AdminMenu";
import AdminOutletInfo from "./Admin/AdminOutletInfo";
import AdminOrderHistory from "./Admin/AdminOrderHistory";
import AdminOffers from "./Admin/AdminOffers";
import Dashboard from "./Admin/Dashboard";
import AdminProductDetails from "./Admin/AdminProductDetails";
import AddNewItem from "./Admin/AddNewItem";
import UpdateProduct from "./Admin/UpdateProduct";
import CODOrderSuccess from "./Account/CODOrderSuccess";
function App() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Navbar and Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="account" element={<Account />} />
          <Route path="search" element={<Search />} />
          <Route path="login" element={<LoginRegisterForm />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route
            path="account/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="account/orders" element={<Orders />} />
          <Route path="account/address" element={<Address />} />
          
          <Route path="password/update" element={<UpdatePassword />} />
          <Route path="password/forgot" element={<ForgotPassword />} />
          <Route path="password/reset/:token" element={<ResetPassword />} />
          <Route path="/order/creation" element={<CODOrderSuccess />} />
          <Route
            path="shipping"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />
          <Route
            path="order/confirm"
            element={
              <ProtectedRoute>
                <ConfirmOrder />
              </ProtectedRoute>
            }
          />
          <Route path="success" element={<PaymentSuccess />} />
          
          <Route
            path="account/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Route without Navbar and Footer */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute>
              <AdminMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/order-history"
          element={
            <ProtectedRoute>
              <AdminOrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/offers"
          element={
            <ProtectedRoute>
              <AdminOffers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/outlet-info"
          element={
            <ProtectedRoute>
              <AdminOutletInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product-details/:id"
          element={
            <ProtectedRoute>
              <AdminProductDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add/new-item"
          element={
            <ProtectedRoute>
              <AddNewItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-item/:id"
          element={
            <ProtectedRoute>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
