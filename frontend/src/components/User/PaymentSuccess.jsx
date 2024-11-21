import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../../actions/orderAction";
import "./PaymentSuccess.css";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const PaymentSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get("reference");
  const status = queryParams.get("status");
  const token = queryParams.get("token");

  const { user } = useSelector((state) => state.user);
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const deliveryInfo = JSON.parse(localStorage.getItem("shippingInfo"));

  useEffect(() => {
    if (status === "success" && reference && token) {
      handleCreateOrder(token);
    }
  }, [status, reference, token]);
  console.log(user);
  const handleCreateOrder = (token) => {
    console.log("orderInfo:", orderInfo);
    console.log("cartItems:", cartItems);
    const order = {
      deliveryInfo: {
        location: {
          type: "Point",
          coordinates: [deliveryInfo.longitude, deliveryInfo.latitude],
        },
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        pincode: deliveryInfo.pincode,
        phone: deliveryInfo.phone,
      },
      orderItems: cartItems,
      paymentInfo: {
        id: reference,
        status: "paid",
      },
      itemPrice: orderInfo.subtotal,
      deliveryPrice: orderInfo.deliveryCharge,
      discount: orderInfo.discount,
      taxPrice: orderInfo.gst,
      instruction: orderInfo.instruction,
      totalPrice: orderInfo.total,
      userDetails: {
        username: user.name,
      },
      token,
    };

    dispatch(createOrder(order))
      .then(() => {
        // Clear session storage after successful order creation
        localStorage.removeItem("shippingInfo");
        sessionStorage.removeItem("orderInfo");
        localStorage.removeItem("cartItems");
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  };

  return (
    <div className="paymentSuccess-main">
      <IoIosCheckmarkCircleOutline size={90} color="green" />
      <p>Wow! Order placed successfully</p>
      <span>Payment ID: {reference}</span>
      <Link to="/account/orders">View Order</Link>
    </div>
  );
};

export default PaymentSuccess;
