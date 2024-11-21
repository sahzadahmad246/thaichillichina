import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDER_REQUEST,
  MY_ORDER_SUCCESS,
  MY_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAIL,
  UPDATE_ORDER_STATUS_RESET,
  CREATE_COD_ORDER_REQUEST,
  CREATE_COD_ORDER_SUCCESS,
  CREATE_COD_ORDER_FAIL,
  CLEAR_ERRORS,
} from "../constants/orderConstant";

// reducer to create a new order
const initialState = {
  loading: false,
  order: null,
  error: null,
};

export const newOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
      };
    case CREATE_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};


// reducer to create a new cod order
const initialCODOrderState = {
  loading: false,
  order: null,
  error: null,
};

export const codOrderReducer = (state = initialCODOrderState, action) => {
  switch (action.type) {
    case CREATE_COD_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_COD_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
      };
    case CREATE_COD_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};


// reducer to fetch my orders
const initialMyOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const myOrdersReducer = (state = initialMyOrdersState, action) => {
  switch (action.type) {
    case MY_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case MY_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };
    case MY_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// reducer to fetch an order details using order id
const initialOrderDetailsState = {
  order: {},
  loading: false,
  error: null,
};

export const orderDetailsReducer = (
  state = initialOrderDetailsState,
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
      };
    case ORDER_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// reducer to fetch all orders
const initialAllOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const allOrdersReducer = (state = initialAllOrdersState, action) => {
  switch (action.type) {
    case ALL_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };
    case ALL_ORDERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};


// reducer to update order status
const initialUpdateOrderStatusState = {
  loading: false,
  isUpdated: false,
  error: null,
};

export const updateOrderStatusReducer = (state = initialUpdateOrderStatusState, action) => {
  switch (action.type) {
    case UPDATE_ORDER_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: true,
      };
    case UPDATE_ORDER_STATUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_ORDER_STATUS_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

