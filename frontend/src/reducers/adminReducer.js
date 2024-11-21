import {
  GET_ALL_USER_REQUEST,
  GET_ALL_USER_SUCCESS,
  GET_ALL_USER_FAIL,
  GET_SINGLE_USER_REQUEST,
  GET_SINGLE_USER_SUCCESS,
  GET_SINGLE_USER_FAIL,
  ADD_NEW_PRODUCT_REQUEST,
  ADD_NEW_PRODUCT_SUCCESS,
  ADD_NEW_PRODUCT_RESET,
  ADD_NEW_PRODUCT_FAIL,
  UPDATE_STOCK_REQUEST,
  UPDATE_STOCK_SUCCESS,
  UPDATE_STOCK_FAIL,
  UPDATE_STOCK_RESET,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_RESET,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_RESET,
  UPDATE_PRODUCT_FAIL,
  ADD_OUTLET_INFO_REQUEST,
  ADD_OUTLET_INFO_SUCCESS,
  ADD_OUTLET_INFO_RESET,
  ADD_OUTLET_INFO_FAIL,
  UPDATE_OUTLET_INFO_REQUEST,
  UPDATE_OUTLET_INFO_SUCCESS,
  UPDATE_OUTLET_INFO_RESET,
  UPDATE_OUTLET_INFO_FAIL,
  GET_OUTLET_INFO_REQUEST,
  GET_OUTLET_INFO_SUCCESS,
  GET_OUTLET_INFO_FAIL,
  CLEAR_ERRORS,
} from "../constants/adminConstant";

export const allUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case GET_ALL_USER_REQUEST:
      return {
        loading: true,
        users: [],
      };

    case GET_ALL_USER_SUCCESS:
      return {
        loading: false,
        users: action.payload,
      };

    case GET_ALL_USER_FAIL:
      return {
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

export const singleUserReducer = (state = { users: {} }, action) => {
  switch (action.type) {
    case GET_SINGLE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_SINGLE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: {
          ...state.users,
          [action.payload.id]: action.payload.user,
        },
      };
    case GET_SINGLE_USER_FAIL:
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

// Reducer for adding a new product
export const addNewProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case ADD_NEW_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_NEW_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.success,
        product: action.payload.product,
      };
    case ADD_NEW_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_NEW_PRODUCT_RESET:
      return {
        ...state,
        success: false,
        error: null, // Reset error state if needed
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

// Reducer for updating a  product
export const updateProductReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_PRODUCT_RESET:
      return {
        ...state,
        isUpdated: false,
        error: null,
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

// Reducer for updating stock status
export const updateStockReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_STOCK_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_STOCK_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case UPDATE_STOCK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_STOCK_RESET:
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

// Reducer for deleting a product
export const deleteProductReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    case DELETE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_PRODUCT_RESET:
      return {
        ...state,
        isDeleted: false,
      };
    default:
      return state;
  }
};


// Reducer for adding outlet information
export const addOutletInfoReducer = (state = { outlet: {} }, action) => {
  switch (action.type) {
    case ADD_OUTLET_INFO_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_OUTLET_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload.success,
        outlet: action.payload.outlet,
      };
    case ADD_OUTLET_INFO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ADD_OUTLET_INFO_RESET:
      return {
        ...state,
        success: false,
        error: null, // Reset error state if needed
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

// Reducer for updating outlet information
export const updateOutletInfoReducer = (state = { outlet: {} }, action) => {
  switch (action.type) {
    case UPDATE_OUTLET_INFO_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_OUTLET_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case UPDATE_OUTLET_INFO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case UPDATE_OUTLET_INFO_RESET:
      return {
        ...state,
        isUpdated: false,
        error: null, // Reset error state if needed
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




export const getOutletInfoReducer = (state = { outlet: {} }, action) => {
  switch (action.type) {
    case GET_OUTLET_INFO_REQUEST:
      return {
        ...state,
        loading: true
      };
    case GET_OUTLET_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        outlet: action.payload
      };
    case GET_OUTLET_INFO_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};