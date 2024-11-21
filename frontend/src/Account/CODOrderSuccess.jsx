import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { createCODOrder } from "../actions/orderAction";
import { removeItemFromCart } from "../actions/cartAction";
import Loader from "../components/Layout/Loader";
const CODOrderSuccess = () => {
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.user);
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const deliveryInfo = JSON.parse(localStorage.getItem("shippingInfo"));

  useEffect(() => {
    const createOrderAsync = async () => {
      try {
        console.log("orderInfo:", orderInfo); // Add this line

        console.log("cartItems:", cartItems); // Add this line

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
            id: null,
            status: "Cash on delivery",
          },
          itemPrice: orderInfo.subtotal,
          deliveryPrice: orderInfo.deliveryCharge,
          discount: orderInfo.discount,
          taxPrice: orderInfo.gst,
          instruction: orderInfo.instruction,
          totalPrice: orderInfo.total, 
        };

        console.log("Dispatching COD order:", order);

        const response = await dispatch(createCODOrder(order))
          .then(() => {
            localStorage.removeItem("shippingInfo");
            sessionStorage.removeItem("orderInfo");
            localStorage.removeItem("cartItems");
          })
          .catch((error) => {
            console.error("Error creating order:", error);
          });

        if (response && response.orderId) {
          setOrderId(response.orderId);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error in createOrderAsync:", err);
        setError(
          "An error occurred while creating the order. Please try again."
        );
        setLoading(false);
      }
    };

    createOrderAsync();
  }, [dispatch]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="paymentSuccess-main">
      <IoIosCheckmarkCircleOutline size={90} color="green" />
      <p>Wow! Order placed successfully</p>
      {orderId && <span>Order ID: {orderId}</span>}
      <Link to="/account/orders">View Order</Link>
    </div>
  );
};

export default CODOrderSuccess;
