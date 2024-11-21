import React, { useEffect, useState, useCallback } from "react";
import "./AdminOrders.css";
import AdminNav from "./AdminNav";
import { CiSearch } from "react-icons/ci";
import DashboardTop from "./DashboardTop";
import MetaData from "../components/Home/MetaData";
import { useDispatch, useSelector } from "react-redux";
import newOrderSound from "../images/newOrderAlert.mp3";
import { IoMdClose } from "react-icons/io";
import AdminFilteredOrders from "./AdminOrderFilter";
import { MdEditNote } from "react-icons/md";
import {
  getAllOrders,
  clearErrors,
  updateOrderStatus,
} from "../actions/orderAction";
import { getOutletInfo } from "../actions/adminAction";
import { getSingleUser } from "../actions/adminAction";
import { MdOutlineLocationOn } from "react-icons/md";
import { format } from "date-fns";
import { BsPrinter } from "react-icons/bs";
import { IoIosCall } from "react-icons/io";
import { FaBox } from "react-icons/fa";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import NewOrderPopup from "./NewOrderPopup";
import OrderStatusStepper from "./OrderStatusStepper";
import OrderBill from "./OrderBill";
import { FaRegUserCircle } from "react-icons/fa";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { error, orders, loading } = useSelector((state) => state.allOrders);
  const { outlet } = useSelector((state) => state.getOutletInfo);
  const { users } = useSelector((state) => state.singleUser);
  const { error: updateError } = useSelector((state) => state.orderStatus);

  // States
  const [loadingButton, setLoadingButton] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState("Accepted");
  const [newOrders, setNewOrders] = useState([]);
  const [prevOrdersLength, setPrevOrdersLength] = useState(0);
  const [showBill, setShowBill] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders
  const fetchOrders = useCallback(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Initial fetch and polling
  useEffect(() => {
    fetchOrders();
    dispatch(getOutletInfo());
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders, dispatch]);

  // Error handling
  useEffect(() => {
    if (error || updateError) {
      dispatch(clearErrors());
    }
  }, [error, updateError, dispatch]);

  // Handle new orders and notifications
  useEffect(() => {
    if (orders && orders.length > 0) {
      const placedOrders = orders.filter(
        (order) => order.orderStatus === "Placed"
      );
      setNewOrders(placedOrders);

      if (orders.length > prevOrdersLength && placedOrders.length > 0) {
        const audio = new Audio(newOrderSound);
        audio.play();
      }
      setPrevOrdersLength(orders.length);
    }
  }, [orders, prevOrdersLength]);

  // Order status handlers
  const handleOrderStatusChange = async (orderId, currentStatus) => {
    setLoadingButton(true);
    let nextStatus = "";

    switch (currentStatus) {
      case "Accepted":
        nextStatus = "Ready";
        break;
      case "Ready":
        nextStatus = "On the way";
        break;
      case "On the way":
        nextStatus = "Delivered";
        break;
      default:
        setLoadingButton(false);
        return;
    }

    try {
      await dispatch(updateOrderStatus(orderId, nextStatus));
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setLoadingButton(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setLoadingButton(true);
    try {
      await dispatch(updateOrderStatus(orderId, "cancelled"));
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setLoadingButton(false);
    }
  };

  const handleOrderProcessed = (orderId) => {
    setNewOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );
  };

  // Bill handlers
  const handlePrintBill = (order) => {
    setSelectedOrder(order);
    setShowBill(true);
  };

  const closeBill = () => {
    setShowBill(false);
    setSelectedOrder(null);
  };

  return (
    <div className="dashboard-main">
      <MetaData title="Orders - Thai Chilli China" />
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right">
          <Dialog open={showBill} onClose={closeBill} maxWidth="md" fullWidth>
            <DialogTitle>Order Bill</DialogTitle>
            <DialogContent>
              {selectedOrder && <OrderBill order={selectedOrder} />}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeBill} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <AdminFilteredOrders
            orders={orders}
            activeStatus={activeStatus}
            searchTerm={searchTerm}
            users={users}
            setFilteredOrders={setFilteredOrders}
          />
          <div className="live-order-top">
            <div className="live-order-top-1">
              <span
                onClick={() => setActiveStatus("Accepted")}
                className={activeStatus === "Accepted" ? "active-status" : ""}
              >
                Preparing
              </span>
              <span
                onClick={() => setActiveStatus("Ready")}
                className={activeStatus === "Ready" ? "active-status" : ""}
              >
                Ready
              </span>
              <span
                onClick={() => setActiveStatus("On the way")}
                className={activeStatus === "On the way" ? "active-status" : ""}
              >
                On the way
              </span>
              <span
                onClick={() => setActiveStatus("Delivered")}
                className={activeStatus === "Delivered" ? "active-status" : ""}
              >
                Delivered
              </span>
              <span
                onClick={() => setActiveStatus("Undelivered")}
                className={
                  activeStatus === "Undelivered" ? "active-status" : ""
                }
              >
                Undelivered
              </span>
            </div>

            <div className="live-order-top-2">
              <CiSearch />
              <input
                type="text"
                placeholder="Search orders"
                className="px-2 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="order-list">
            {filteredOrders.length === 0 ? (
              <div className="no-orders">
                {orders.length === 0 ? (
                  <>
                    <CiSearch size={50} color="#ff004d" />
                    <p>Searching for new orders</p>
                  </>
                ) : (
                  <FaBox size={50} color="#ff004d" />
                )}
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
                        <span className="text-slate-500">ID: #{order._id}</span>
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
                            href={`tel:+${order.deliveryInfo.phone}`}
                            className="text-slate-500"
                          >
                            Call Customer
                          </a>
                        </span>{" "}
                        {order.instruction && (
                          <span className="d-flex items-center">
                            <span className="bg-gray-200 p-2 m-2 rounded-full">
                              <MdEditNote size={25} />
                            </span>

                            <span className="text-slate-500">
                              {order.instruction}
                            </span>
                          </span>
                        )}
                        <div className="d-flex justify-center mt-2.5">
                          {order.orderStatus !== "Delivered" &&
                            order.orderStatus !== "cancelled" &&
                            order.orderStatus !== "Rejected" && (
                              <Button
                                sx={{
                                  border: "1px solid red",
                                  color: "red",
                                  width: "90%",
                                  "&:hover": {
                                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                                  },
                                }}
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                Cancel order
                              </Button>
                            )}
                        </div>
                      </div>
                      <div className="live-order-box-2-right">
                        <>
                          {order.orderItems?.map((item) => (
                            <div key={item.product} className="live-order-item">
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
                              <span className="px-2">₹{order.totalPrice}</span>
                              <span
                                className={
                                  order.paymentInfo.status === "paid"
                                    ? "text-success"
                                    : "text-danger"
                                }
                                title={
                                  order.paymentInfo.status === "paid"
                                    ? "Paid Online"
                                    : "Cash on delivery"
                                }
                              >
                                {order.paymentInfo.status === "paid"
                                  ? "Paid"
                                  : "COD"}
                              </span>
                            </span>
                            <span className="d-flex items-center text-blue-600">
                              <Button
                                variant="text"
                                className={`${
                                  loadingButton
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() => handlePrintBill(order)}
                                disabled={loadingButton}
                                startIcon={
                                  loadingButton ? (
                                    <CircularProgress
                                      size={20}
                                      color="inherit"
                                    />
                                  ) : (
                                    <BsPrinter />
                                  )
                                }
                              >
                                Print bill
                              </Button>
                            </span>
                          </div>
                          <div className="order-ready-btn">
                            {order.orderStatus === "Delivered" ? (
                              <span className="text-green-600">
                                Order was delivered on{" "}
                                {format(
                                  new Date(order.deliveredAt),
                                  "dd/MM/yyyy, 'at' hh:mm a"
                                )}
                              </span>
                            ) : order.orderStatus === "cancelled" ? (
                              <span className="text-red-600">
                                This order was cancelled
                              </span>
                            ) : order.orderStatus === "Rejected" ? (
                              <span className="text-red-600">
                                You Rejected this order
                              </span>
                            ) : (
                              <Button
                                variant="contained"
                                className={`bg-blue-500 text-white ${
                                  loadingButton
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleOrderStatusChange(
                                    order._id,
                                    order.orderStatus
                                  )
                                }
                                disabled={loadingButton}
                                startIcon={
                                  loadingButton ? (
                                    <CircularProgress
                                      size={20}
                                      color="inherit"
                                    />
                                  ) : null
                                }
                              >
                                {loadingButton ? (
                                  ""
                                ) : (
                                  <>
                                    {order.orderStatus === "Accepted" &&
                                      "Mark order ready"}
                                    {order.orderStatus === "Ready" &&
                                      "Mark on the way"}
                                    {order.orderStatus === "On the way" &&
                                      "Mark delivered"}
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {newOrders.length > 0 && (
            <NewOrderPopup
              orders={newOrders}
              onOrderProcessed={handleOrderProcessed}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
