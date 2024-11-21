import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountNav from "./AccountNav";
import { Link, useNavigate } from "react-router-dom";
import { myOrders, clearErrors } from "../actions/orderAction";
import Loader from "../components/Layout/Loader";
import MetaData from "../components/Home/MetaData";
import { format } from "date-fns";
import mannualPic from "../images/china.png";
import "./Orders.css";
import FilterOrders from "./FilterOrders";
import { FaBox } from "react-icons/fa";

const Orders = () => {
  const { user } = useSelector((state) => state.user);
  const { error, orders, loading } = useSelector((state) => state.myOrders);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    last30Days: false,
    month: "",
    year: "",
  });

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, error]);

  useEffect(() => {
    filterOrders();
  }, [orders, filter, searchQuery]);

  const handleBack = () => {
    navigate(-1);
  };

  const renderOrderItems = (orderItems) => {
    if (orderItems?.length > 2) {
      return (
        <>
          {orderItems.slice(0, 2).map((item, index) => (
            <span key={index}>
              {item.name}
              {index < 2 && ", "}
            </span>
          ))}
          &nbsp;& more
        </>
      );
    } else {
      return orderItems?.map((item, index) => (
        <span key={index}>
          {item.name}
          {index < orderItems.length - 1 && ", "}
        </span>
      ));
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "hh:mm a 'on' dd-MMMM-yyyy");
  };

  const filterOrders = () => {
    let filtered = [...orders];
    const today = new Date();

    if (filter.status) {
      filtered = filtered.filter(
        (order) => order.orderStatus === filter.status
      );
    }

    if (filter.last30Days) {
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      filtered = filtered.filter(
        (order) => new Date(order.createdAt) >= last30Days
      );
    }

    if (filter.month) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.createdAt).getMonth() + 1 === parseInt(filter.month)
      );
    }

    if (filter.year) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.createdAt).getFullYear() === parseInt(filter.year)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderItems?.some((item) =>
            item.name.toLowerCase().includes(query)
          ) ||
          order._id.toLowerCase().includes(query) ||
          order.totalPrice.toString().includes(query)
      );
    }

    setFilteredOrders(filtered.reverse());
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <MetaData title="My Orders" />
      <div className="profile-container">
        <div className="profile-left">
          <AccountNav />
        </div>
        <div className="profile-right">
          <div className="account-top">
            <span className="material-symbols-outlined" onClick={handleBack}>
              arrow_back
            </span>
            <p>My Orders</p>
            <img src={user.avatar && user.avatar.url} alt="Profile" />
          </div>
          <div className="orders-info">
            <div className="orders-info-left">
              <FilterOrders
                filter={filter}
                handleFilterChange={handleFilterChange}
              />
            </div>
            <div className="orders-info-right">
              <div className="orders-info-right-top">
                <span>My Orders</span>
                <input
                  type="text"
                  placeholder="Search orders"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="my-orders-list">
                  {filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <Link
                        to={`/account/orders/${order._id}`}
                        key={order._id}
                        className="my-order-item"
                      >
                        <div className="d-flex items-center">
                          <img
                            src={
                              order.orderItems &&
                              order.orderItems.length > 0 &&
                              order.orderItems[0].image.url
                            }
                            alt="pic"
                          />
                          <div className="mx-3 my-order-name">
                            <h1 className=" font-sans fw-bold">
                              {renderOrderItems(order.orderItems)}
                            </h1>
                            <span className="d-flex flex-col">
                              <span className="text-slate-700 my-order-id">
                                Order {`#${order._id}`}
                              </span>
                              <span className="text-slate-700">
                                {formatDate(order.createdAt)}
                              </span>
                            </span>
                          </div>
                        </div>
                        <span className="my-order-item-price">
                          <span className="fw-bold">₹{order.totalPrice}</span>
                          <span
                            className={
                              order.orderStatus === "Delivered"
                                ? "bg-success px-2 rounded-full text-light"
                                : order.orderStatus === "Rejected" ||
                                  order.orderStatus === "cancelled"
                                ? "bg-danger px-2 rounded-full text-light"
                                : "bg-yellow-500 px-2 rounded-full text-light"
                            }
                          >
                            {order.orderStatus}
                          </span>
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="no-orders">
                      <FaBox size={50} color="#ff004d" />
                      <p>No orders found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
