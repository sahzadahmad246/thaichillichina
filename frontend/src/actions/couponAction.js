import axios from "axios";
import {
  COUPON_CREATE_REQUEST,
  COUPON_CREATE_SUCCESS,
  COUPON_CREATE_FAIL,
  COUPON_CREATE_RESET,
  COUPON_REDEEM_REQUEST,
  COUPON_REDEEM_SUCCESS,
  COUPON_REDEEM_FAIL,
  COUPON_LIST_REQUEST,
  COUPON_LIST_SUCCESS,
  COUPON_LIST_FAIL,
  COUPON_DELETE_REQUEST,
  COUPON_DELETE_SUCCESS,
  COUPON_DELETE_FAIL,
  COUPON_EXPIRE_REQUEST,
  COUPON_EXPIRE_SUCCESS,
  COUPON_EXPIRE_FAIL,
} from "../constants/couponConstant";

// Create Coupon Action
export const createCoupon = (couponData) => async (dispatch) => {
  try {
    dispatch({ type: COUPON_CREATE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Include this if you're using cookies for authentication
    };

    const { data } = await axios.post(
      "/api/v1/create/coupon", // Relative URL
      couponData,
      config
    );

    dispatch({
      type: COUPON_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Redeem Coupon Action
export const redeemCoupon = (couponCode, subtotal) => async (dispatch) => {
  try {
    dispatch({ type: COUPON_REDEEM_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      "/api/v1/redeem-coupon", // Relative URL
      { couponCode, subtotal },
      config
    );

    dispatch({
      type: COUPON_REDEEM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_REDEEM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Get All Coupons Action
export const getAllCoupons = () => async (dispatch) => {
  try {
    dispatch({ type: COUPON_LIST_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      "/api/v1/get-all-coupons", 
      config
    );

    dispatch({
      type: COUPON_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete Coupon Action
export const deleteCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: COUPON_DELETE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    await axios.delete(
      `/api/v1/delete-coupon/${id}`, 
      config
    );

    dispatch({ type: COUPON_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: COUPON_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Expire Coupon Action
export const expireCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: COUPON_EXPIRE_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    await axios.put(
      `/api/v1/expire-coupon/${id}`, 
      {},
      config
    );

    dispatch({ type: COUPON_EXPIRE_SUCCESS });
  } catch (error) {
    dispatch({
      type: COUPON_EXPIRE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
