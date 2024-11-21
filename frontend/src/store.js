import { configureStore } from "@reduxjs/toolkit";

// Product Reducers
import {
  newReviewReducer,
  productDetailsReducer,
  productReducer,
  adminAllProductReducer,
} from "./reducers/productReducer";

// User Reducers
import { forgotPasswordReducer, userReducer } from "./reducers/userReducer";

// Cart Reducer
import { cartReducer } from "./reducers/cartReducer";

// Location Reducer
import locationReducer from "./reducers/otherReducer";

// Order Reducers
import {
  newOrderReducer,
  allOrdersReducer,
  myOrdersReducer,
  orderDetailsReducer,
  codOrderReducer,
} from "./reducers/orderReducer";

// Admin Reducers (Products and Outlets)
import {
  addNewProductReducer,
  allUsersReducer,
  deleteProductReducer,
  singleUserReducer,
  updateProductReducer,
  updateStockReducer,
  addOutletInfoReducer,
  updateOutletInfoReducer,
  getOutletInfoReducer,
} from "./reducers/adminReducer";

// Order Status Action
// import { updateOrderStatus } from "./actions/orderAction";
import { updateOrderStatusReducer } from "./reducers/orderReducer";

// Coupon Reducers
import {
  couponCreateReducer,
  couponRedeemReducer,
  couponListReducer,
  couponDeleteReducer,
  couponExpireReducer,
} from "./reducers/couponReducer";

// Preload Cart Items from Local Storage
const cartItems = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  cart: {
    cartItems: cartItems,
  },
};

const store = configureStore({
  reducer: {
    // Product-related reducers
    products: productReducer,
    productDetails: productDetailsReducer,
    adminProducts: adminAllProductReducer,
    review: newReviewReducer,
    // User-related reducers
    user: userReducer,
    forgotPassword: forgotPasswordReducer,

    // Cart reducer
    cart: cartReducer,

    // Order-related reducers
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrdersReducer,
    codOrder: codOrderReducer,
    orderStatus: updateOrderStatusReducer,

    // Admin-related reducers (User, Product, Outlet)
    allUsers: allUsersReducer,
    singleUser: singleUserReducer,
    newProduct: addNewProductReducer,
    deleteProduct: deleteProductReducer,
    updateProduct: updateProductReducer,
    updateStock: updateStockReducer,
    addOutletInfo: addOutletInfoReducer,
    updateOutletInfo: updateOutletInfoReducer,
    getOutletInfo: getOutletInfoReducer,

    // Location reducer
    location: locationReducer,

    // Coupon-related reducers
    couponCreate: couponCreateReducer,
    couponRedeem: couponRedeemReducer,
    couponList: couponListReducer,
    couponDelete: couponDeleteReducer,
    couponExpire: couponExpireReducer,
  },
  preloadedState: initialState,
});

export default store;
