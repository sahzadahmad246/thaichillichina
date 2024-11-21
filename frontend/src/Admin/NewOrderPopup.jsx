import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../actions/orderAction";
import "./NewOrderPopup.css";
import { MdOutlineLocationOn } from "react-icons/md";
import { PiCurrencyInr } from "react-icons/pi";

const NewOrderPopup = ({ orders, onOrderProcessed }) => {
  const dispatch = useDispatch();
  const [loadingButtons, setLoadingButtons] = React.useState({});

  const handleOrderAction = (orderId, status) => {
    setLoadingButtons((prev) => ({ ...prev, [orderId]: true }));
    dispatch(updateOrderStatus(orderId, status))
      .then(() => {
        setLoadingButtons((prev) => ({ ...prev, [orderId]: false }));
        onOrderProcessed(orderId);
      })
      .catch(() => {
        setLoadingButtons((prev) => ({ ...prev, [orderId]: false }));
      });
  };

  return (
    <div className="new-order-popup">
      <h2 className="text-center fw-bold">New Order Alerts!</h2>
      {orders?.map((order) => (
        <>
          <div key={order._id} className="order-alert-main">
            <div className="order-alert-left ">
              <span className="d-flex items-center">
                <span className="bg-gray-200 p-2 m-2 rounded-full">
                  <MdOutlineLocationOn size={25} />
                </span>
                <span className="text-slate-500">
                  {order.deliveryInfo.address} {order.deliveryInfo.city}{" "}
                  {order.deliveryInfo.pincode}
                </span>
              </span>
              <span className="d-flex items-center">
                <span className="bg-gray-200 p-2 m-2 rounded-full">
                  <PiCurrencyInr size={25} />
                </span>
                <span>Order Value ₹{order.totalPrice}</span>
              </span>
            </div>
            <div className="order-alert-right ">
              {order.orderItems?.map((item) => (
                <div key={item.product} className="live-order-item p-3">
                  <span className="order-item-name ps-2 text-slate-500">
                    {item.name}
                  </span>
                  <span>
                    <span className="order-item-price ps-2">₹{item.price}</span>
                    <span className="order-item-quantity ps-2">
                      x {item.quantity}
                    </span>
                    <span className="order-item-total ps-2">
                      ₹{item.price * item.quantity}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="newOrder-actionButton  d-flex justify-between mt-5">
            <Button
              variant="outlined"
              color="error"
              className=" w-5/12 "
              onClick={() => handleOrderAction(order._id, "Rejected")}
              disabled={loadingButtons[order._id]}
              startIcon={
                loadingButtons[order._id] ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {loadingButtons[order._id] ? "Processing..." : "Reject Order"}
            </Button>
            <Button
              variant="contained"
              className="bg-blue-500 text-white w-5/12 "
              onClick={() => handleOrderAction(order._id, "Accepted")}
              disabled={loadingButtons[order._id]}
              startIcon={
                loadingButtons[order._id] ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {loadingButtons[order._id] ? "Processing..." : "Accept Order"}
            </Button>
          </div>
        </>
      ))}
    </div>
  );
};

export default NewOrderPopup;
