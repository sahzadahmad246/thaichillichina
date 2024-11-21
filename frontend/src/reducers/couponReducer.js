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

export const couponCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_CREATE_REQUEST:
      return { loading: true };
    case COUPON_CREATE_SUCCESS:
      return { loading: false, success: true, coupon: action.payload };
    case COUPON_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case COUPON_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

// Coupon Reducer - Redeem Coupon
export const couponRedeemReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_REDEEM_REQUEST:
      return { loading: true };
    case COUPON_REDEEM_SUCCESS:
      return {
        loading: false,
        success: true,
        discount: action.payload.discount,
        total: action.payload.total,
      };
    case COUPON_REDEEM_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Coupon Reducer - Get All Coupons
export const couponListReducer = (state = { coupons: [] }, action) => {
  switch (action.type) {
    case COUPON_LIST_REQUEST:
      return { loading: true, coupons: [] };
    case COUPON_LIST_SUCCESS:
      return { loading: false, coupons: action.payload };
    case COUPON_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Coupon Reducer - Delete Coupon
export const couponDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_DELETE_REQUEST:
      return { loading: true };
    case COUPON_DELETE_SUCCESS:
      return { loading: false, success: true };
    case COUPON_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Coupon Reducer - Expire Coupon
export const couponExpireReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON_EXPIRE_REQUEST:
      return { loading: true };
    case COUPON_EXPIRE_SUCCESS:
      return { loading: false, success: true };
    case COUPON_EXPIRE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
