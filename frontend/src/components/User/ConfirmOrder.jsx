import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { createOrder } from "../../actions/orderAction";
import { redeemCoupon } from "../../actions/couponAction";
import CheckoutSteps from "./CheckoutSteps";

export default function ConfirmOrder() {
  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const { outlet } = useSelector((state) => state.getOutletInfo);
  const {
    loading: redeeming,
    discount: couponValue,
    success: redeemed,
    error: redeemError,
  } = useSelector((state) => state.couponRedeem);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [codLoading, setCodLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [openInstructionDialog, setOpenInstructionDialog] = useState(false);
  const [instruction, setInstruction] = useState("");

  const subtotal = Math.round(
    cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
  );
  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const deliveryCharge = 0;
  const discount = couponValue || 0;
  const gst = Math.round(subtotal * 0.05); 
  const total = Math.round(subtotal + deliveryCharge - discount + gst);

  useEffect(() => {
    if (redeemed) {
      setOpenDialog(false);
    }
  }, [redeemed]);

  const handleApplyCoupon = () => {
    dispatch(redeemCoupon(couponCode, subtotal));
  };

  const handleAddInstruction = () => {
    setOpenInstructionDialog(false);
  };

  const proceedToPay = async () => {
    setLoading(true);
    const paymentData = {
      subtotal,
      deliveryCharge,
      gst,
      discount,
      total,
      instruction,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(paymentData));

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    try {
      const {
        data: { key },
      } = await axios.get(
        "/api/v1/getkey",
        config
      );

      const {
        data: { order },
      } = await axios.post(
        "/api/v1/process/payment",
        { total, instruction },
        config
      );

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Thai Chilli China",
        description: "For order from Thai Chilli China",
        image: "https://avatars.githubusercontent.com/u/124631079?s=400&v=4",
        order_id: order.id,
        callback_url:
          "https://thaichillichina.onrender.com/api/v1/paymentVerification",
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          address: "Hiranandani Estate",
          instruction: instruction,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
      setLoading(false);
    } catch (error) {
      console.error("Error processing payment:", error);
      setLoading(false);
    }
  };

  const placeCODOrder = async () => {
    setCodLoading(true);
    const paymentData = {
      subtotal,
      deliveryCharge,
      gst,
      discount,
      total,
      instruction,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(paymentData));
    navigate("/order/creation");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <CheckoutSteps activeStep={1} />
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-1xl font-bold mb-4">Delivering to</h2>
            <div className="space-y-2 d-flex flex-col">
              <span>
                <i className="fas fa-user mr-2"></i>
                {user && user.name}
              </span>
              <span>
                <i className="fas fa-phone mr-2"></i>
                {user && user.phone}
              </span>
              <span>
                <i className="fas fa-envelope mr-2"></i>
                {user && user.email}
              </span>
              <span>
                <i className="fas fa-home mr-2"></i>
                {user?.deliveryInfo?.address || "No address found"}
              </span>
              <span>
                <i className="fas fa-city mr-2"></i>
                {user?.deliveryInfo?.city || "No city found"}
              </span>
              <span>
                <i className="fas fa-map-pin mr-2"></i>
                {user?.deliveryInfo?.pincode || "No pincode found"}
              </span>
            </div>
          </div>
          <Paper elevation={3} className="p-4">
            <Typography variant="h6" gutterBottom>
              Special Instructions
            </Typography>
            {instruction ? (
              <Typography variant="body1" gutterBottom>
                {instruction}
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary" gutterBottom>
                No instructions added
              </Typography>
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenInstructionDialog(true)}
              className="mt-2"
            >
              {instruction ? "Edit Instructions" : "Add Instructions"}
            </Button>
          </Paper>
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-1xl font-bold mb-4">Items in your cart</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image.url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Link
                      to={`/product/${item.product}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <span>
                    {item.quantity} x ₹{item.price} ={" "}
                    <b>₹{item.price * item.quantity}</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-1xl font-bold mb-6">Price Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal ({totalQuantity} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST @5%</span>
              <span className="text-danger"> + ₹{gst}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>
                {deliveryCharge === 0 ? (
                  <>
                    <span className="line-through">₹40</span>
                    <span className="text-success"> FREE</span>
                  </>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-success">- ₹{discount}</span>
            </div>
            {redeemed ? (
              <div className="flex justify-between">
                <span className="text-success">
                  you have redeemed this coupon successfully
                </span>
                <span className="text-green-700 cursor-pointer   px-2">
                  Coupon applied 🎉
                </span>
              </div>
            ) : (
              <div
                className="flex justify-between "
                onClick={() => setOpenDialog(true)}
              >
                <span></span>
                <span className="text-green-700 cursor-pointer border border-green-600 px-2">
                  Apply Coupon
                </span>
              </div>
            )}
            <button className=" text-black p-2 border-green-200 rounded  "></button>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="mt-6 space-y-4">
              <button
                onClick={proceedToPay}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 disabled:opacity-50"
              >
                {loading ? <CircularProgress sx={{ color: "white" }} size={25} /> : "Pay now"}
              </button>

              <button
                onClick={total <= 1000 ? placeCODOrder : null}
                disabled={codLoading}
                className={`w-full py-2 px-4 rounded transition duration-300 ${
                  total > 1000
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
              >
                {total > 1000 ? (
                  "Cash on delivery not available"
                ) : codLoading ? (
                  <CircularProgress sx={{ color: "white" }} size={25} />
                ) : (
                  "Cash on delivery"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Apply Coupon</DialogTitle>
        <DialogContent>
          <TextField
            label="Coupon Code"
            variant="outlined"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <div className="pl-2 text-danger">{redeemError}</div>
        <DialogActions>
          <Button onClick={handleApplyCoupon} disabled={redeeming}>
            {redeeming ? <CircularProgress size={25} /> : "Apply"}
          </Button>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openInstructionDialog} 
        onClose={() => setOpenInstructionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Instructions</DialogTitle>
        <DialogContent>
          <TextField
            label="Special Instructions"
            variant="outlined"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddInstruction} color="primary">
            Save
          </Button>
          <Button onClick={() => setOpenInstructionDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}