import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { createOrder } from "../../actions/orderAction";

const PaymentSuccess = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const reference = queryParams.get("reference");
  const status = queryParams.get("status");
  const token = queryParams.get("token");

  const { user } = useSelector((state) => state.user);
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo") || "{}");
  const deliveryInfo = JSON.parse(localStorage.getItem("shippingInfo") || "{}");

  useEffect(() => {
    if (status === "success" && reference && token) {
      handleCreateOrder(token);
    }
  }, [status, reference, token]);

  const handleCreateOrder = (token) => {
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
        localStorage.removeItem("shippingInfo");
        sessionStorage.removeItem("orderInfo");
        localStorage.removeItem("cartItems");
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white rounded-lg  p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Order Placed Successfully!</h1>
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <svg className="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>
        <p className="text-xl font-semibold mb-2 text-gray-700">Thank you for your order!</p>
        <p className="text-sm text-gray-600 mb-6">Payment ID: {reference}</p>
        <Link
          to="/account/orders"
          className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          View Order
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

