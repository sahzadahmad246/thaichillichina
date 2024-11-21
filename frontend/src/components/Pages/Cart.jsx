import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import CartItemCard from "../Product/CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { getOutletInfo } from "../../actions/adminAction";
import { loadCartItems } from "../../actions/cartAction";
import MetaData from "../Home/MetaData";
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { outlet } = useSelector((state) => state.getOutletInfo);

  useEffect(() => {
    dispatch(getOutletInfo(outlet._id));
    dispatch(loadCartItems());
  }, [dispatch]);

  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const tax = (subtotal * outlet.taxPercent) / 100;
  const total = subtotal + deliveryCharge + tax;

  const handlePlaceOrder = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <>
      <MetaData title="Cart - Thai Chilli China" />
      {cartItems.length !== 0 ? (
        <div className="cart-main">
          <div className="cart-left">
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
          <div className="cart-right">
            <h1 className="font-bold">Price Details</h1>
            <div className="price-info-boxes">
              <div className="price-info">
                <h2>Subtotal ({totalQuantity} items)</h2>
                <h2>{`₹${subtotal}`}</h2>
              </div>
              <div className="price-info">
                <h2>GST @5%</h2>
                <h2>{`₹${tax}`}</h2>
              </div>
              <div className="price-info">
                <h2>Delivery Charge</h2>
                <h2>
                  {deliveryCharge === 0 ? (
                    <>
                      <span className="line-through">₹40</span>
                      <span className="text-success">FREE</span>
                    </>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </h2>
              </div>
            </div>
            <div className="price-info">
              <h2 className="font-bold">Total</h2>
              <h2 className="font-bold">{`₹${total}`}</h2>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={outlet.outletStatus === "Closed"}
              className={`${
                outlet.outletStatus === "Closed"
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
            >
              {outlet.outletStatus === "Closed"
                ? "Restaurant is closed"
                : "Continue"}
            </button>
          </div>
        </div>
      ) : (
        <div className="no-item">
          <MdOutlineRemoveShoppingCart size={60} />
          <p>No item in the cart</p>
          <Link to="/menu">View menu</Link>
        </div>
      )}
    </>
  );
};

export default Cart;
