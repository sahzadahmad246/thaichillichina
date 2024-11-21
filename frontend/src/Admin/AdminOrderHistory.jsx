import React, { useState, useEffect } from "react";
import "./AdminOrderHistory.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { FaBox } from "react-icons/fa";
import { Button, CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../actions/orderAction";
import OrderStatusStepper from "./OrderStatusStepper";
import Loader from "../components/Layout/Loader";
import { FaRegUserCircle } from "react-icons/fa";
import OrderExportModal from "./OrderExportModal";
import {
  getSingleUser,
  clearErrors as singleUserClearErrors,
} from "../actions/adminAction";
import { getOutletInfo } from "../actions/adminAction";

const AdminOrderHistory = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.singleUser);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("Delivered");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { outlet } = useSelector((state) => state.getOutletInfo);
  // console.log(orders);
  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getOutletInfo());
    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        if (!users[order.user]) {
          dispatch(getSingleUser(order.user));
        }
      });
    }
  }, []);

  useEffect(() => {
    filterOrders(filterType);
  }, [filterType, orders]);

  const filterOrders = (type) => {
    setLoading(true);
    let filtered = [];

    switch (type) {
      case "last7days":
        filtered = filterByLastDays(7);
        break;
      case "last1day":
        filtered = filterByLastDays(1);
        break;
      case "last1month":
        filtered = filterByLastMonth();
        break;
      case "custom":
        // Implement custom date range filtering logic here
        break;
      case "search":
        filtered = searchOrders(searchTerm);
        break;
      case "Rejected":
        filtered = orders.filter(
          (order) =>
            order.orderStatus === "Rejected" ||
            order.orderStatus === "cancelled"
        );
        break;
      case "Delivered":
      default:
        filtered = orders.filter((order) => order.orderStatus === "Delivered");
        break;
    }

    // Reverse the filtered orders to show the latest first
    setFilteredOrders(filtered.reverse());
    setLoading(false);
  };

  const filterByLastDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return orders.filter((order) => {
      const orderDate = new Date(order.deliveredAt);
      return orderDate >= date && order.orderStatus === "Delivered";
    });
  };

  const filterByLastMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    return orders.filter((order) => {
      const orderDate = new Date(order.deliveredAt);
      return orderDate >= date && order.orderStatus === "Delivered";
    });
  };

  const searchOrders = (term) => {
    return orders.filter(
      (order) =>
        order._id.toLowerCase().includes(term.toLowerCase()) ||
        order.deliveryInfo.name?.toLowerCase().includes(term.toLowerCase()) ||
        order.deliveryInfo.phone.includes(term)
    );
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    setFilterType("search");
  };

  return (
    <div className="dashboard-main">
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          {loading ? (
            <Loader />
          ) : (
            <div className="admin-order-history">
              <div className="order-history-filters">
                <div className="filter-buttons">
                  <button
                    className={filterType === "last1day" ? "active-filter" : ""}
                    onClick={() => setFilterType("last1day")}
                  >
                    1D
                  </button>
                  <button
                    className={
                      filterType === "last7days" ? "active-filter" : ""
                    }
                    onClick={() => setFilterType("last7days")}
                  >
                    7D
                  </button>
                  <button
                    className={
                      filterType === "last1month" ? "active-filter" : ""
                    }
                    onClick={() => setFilterType("last1month")}
                  >
                    1M
                  </button>
                  <button
                    className={
                      filterType === "Delivered" ? "active-filter" : ""
                    }
                    onClick={() => setFilterType("Delivered")}
                  >
                    Delivered
                  </button>
                  <button
                    className={filterType === "Rejected" ? "active-filter" : ""}
                    onClick={() => setFilterType("Rejected")}
                  >
                    Undeliverd
                  </button>
                  <button
                    className={filterType === "all" ? "active-filter" : ""}
                    onClick={() => setFilterType("all")}
                  >
                    All Orders
                  </button>
                  {/* Add custom date range filter button */}
                </div>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search orders"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="export-button">
                  <Button onClick={() => setIsExportModalOpen(true)}>
                    Export Orders
                  </Button>
                  <OrderExportModal
                    isOpen={isExportModalOpen}
                    onClose={() => setIsExportModalOpen(false)}
                    orders={filteredOrders}
                    outlet={outlet}
                  />
                </div>
              </div>
              <div className="order-list">
                {loading ? (
                  <div className="loading-spinner">
                    <CircularProgress />
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="no-orders">
                    <FaBox size={50} color="#ff004d" />
                    <p>No orders found</p>
                  </div>
                ) : (
                  <div>
                    {filteredOrders.map((order) => (
                      <div key={order._id} className="live-order-box">
                        <div className="live-order-box-1">
                          <span className="live-order-box-1-1">
                            {users[order.user] &&
                            users[order.user].avatar &&
                            users[order.user].avatar.url ? (
                              <img
                                src={users[order.user].avatar.url}
                                alt={users[order.user].name}
                              />
                            ) : (
                              <FaRegUserCircle size={25} />
                            )}
                            <span className="px-2 d-flex flex-col">
                              <span className="fs-5 fw-bold">
                                {users[order.user]
                                  ? users[order.user].name
                                  : "failed to fetch name..."}
                              </span>
                            </span>
                          </span>
                          <div className="d-flex flex-col items-end">
                            <span>
                              <strong>Order value</strong> ₹{order.totalPrice}
                            </span>
                            <span className="text-slate-900">
                              ID: #{order._id}
                            </span>
                          </div>
                        </div>
                        <OrderStatusStepper
                          statusHistory={order.statusHistory}
                          createdAt={order.createdAt}
                        />
                        <div className="live-order-box-2">
                          <div className="live-order-box-2-left">
                            <span className="d-flex items-center">
                              <span className="bg-gray-200 p-2 m-2 rounded-full">
                                <MdOutlineLocationOn size={25} />
                              </span>
                              <span className="text-slate-500">
                                {order.deliveryInfo.address}{" "}
                                {order.deliveryInfo.city}{" "}
                                {order.deliveryInfo.pincode}
                              </span>
                            </span>
                            <span className="d-flex items-center">
                              <span className="bg-gray-200 p-2 m-2 rounded-full">
                                <IoIosCall size={25} />
                              </span>
                              <a
                                href={`tel:${order.deliveryInfo.phone}`}
                                className="text-slate-500"
                              >
                                {order.deliveryInfo.phone}
                              </a>
                            </span>
                          </div>
                          <div className="live-order-box-2-right">
                            {order.orderItems?.map((item) => (
                              <div
                                key={item.product}
                                className="live-order-item"
                              >
                                <span className="order-item-name ps-2 text-slate-500">
                                  {item.name}
                                </span>
                                <span>
                                  <span className="order-item-price ps-2">
                                    ₹{item.price}
                                  </span>
                                  <span className="order-item-quantity ps-2">
                                    x {item.quantity}
                                  </span>
                                  <span className="order-item-total ps-2">
                                    ₹{item.price * item.quantity}
                                  </span>
                                </span>
                              </div>
                            ))}
                            <div className="live-order-box-2-right-1 d-flex justify-between">
                              <span>
                                Total Bill{" "}
                                <span className="px-2">
                                  ₹{order.totalPrice}
                                </span>
                                <span
                                  className={
                                    order.paymentInfo.status === "paid"
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                >
                                  {order.paymentInfo.status}
                                </span>
                              </span>
                            </div>
                            <span
                              className={
                                order.status === "Delivered"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {order.deliveredAt
                                ? `Order was delivered on ${format(
                                    new Date(order.deliveredAt),
                                    "dd/MM/yyyy, 'at' hh:mm a"
                                  )}`
                                : "Order was not delivered"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderHistory;
