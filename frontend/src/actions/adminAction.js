import axios from "axios";
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

// Get all users (Admin)
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_USER_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.get("/api/v1/admin/users", config);

    dispatch({
      type: GET_ALL_USER_SUCCESS,
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get single user (Admin)
export const getSingleUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_SINGLE_USER_REQUEST });
    const config = {
      withCredentials: true,
    };
    const { data } = await axios.get(`/api/v1/admin/user/${id}`, config);

    dispatch({
      payload: { id, user: data.user },
      type: GET_SINGLE_USER_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: GET_SINGLE_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Add new product (Admin)
export const addNewProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_NEW_PRODUCT_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      "/api/v1/admin/products/new",
      formData,
      config
    );

    dispatch({
      type: ADD_NEW_PRODUCT_SUCCESS,
      payload: data, // Ensure data structure matches expected payload
    });

    dispatch({ type: ADD_NEW_PRODUCT_RESET });
  } catch (error) {
    dispatch({
      type: ADD_NEW_PRODUCT_FAIL,
      payload: error.response.data.message || "Something went wrong",
    });
  }
};

// Update product (Admin)
export const updateProduct = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `/api/v1/admin/products/${id}`,
      formData,
      config
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success, // Ensure this matches what your backend sends
    });

    dispatch({ type: UPDATE_PRODUCT_RESET });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message || "Something went wrong",
    });
  }
};

// Update stock status
export const updateStock = (id, stockStatus) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_STOCK_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `/api/v1/admin/product/stock/${id}`,
      { stock: stockStatus },
      config
    );

    dispatch({
      type: UPDATE_STOCK_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_STOCK_FAIL,
      payload: error.response.data.message || "Something went wrong",
    });
  }
};

// Delete product (Admin)
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const config = {
      withCredentials: true,
    };

    const { data } = await axios.delete(
      `/api/v1/admin/products/${id}`,
      config
    );

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message || "Something went wrong",
    });
  }
};

// Action for adding outlet information
export const addOutletInfo = (formData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_OUTLET_INFO_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      "/api/v1/admin/outlet-info",
      formData,
      config
    );

    dispatch({
      type: ADD_OUTLET_INFO_SUCCESS,
      payload: data,
    });

    dispatch({ type: ADD_OUTLET_INFO_RESET });
  } catch (error) {
    dispatch({
      type: ADD_OUTLET_INFO_FAIL,
      payload: error.response.data.message || "Something went wrong",
    });
  }
};

// Action for updating outlet information
export const updateOutletInfo = (id, formData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_OUTLET_INFO_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `/api/v1/admin/outlet-info/${id}`,
      formData,
      config
    );

    dispatch({
      type: UPDATE_OUTLET_INFO_SUCCESS,
      payload: data.success,
    });

    dispatch({ type: UPDATE_OUTLET_INFO_RESET });
  } catch (error) {
    dispatch({
      type: UPDATE_OUTLET_INFO_FAIL,
      payload: error.response.data.message || "Something went wrong",
    });
  }
};

// Action for getting outlet information
export const getOutletInfo = () => async (dispatch) => {
  try {
    dispatch({ type: GET_OUTLET_INFO_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    };

    const { data } = await axios.get(
      "/api/v1/admin/outlet-info",
      config
    );

    dispatch({
      type: GET_OUTLET_INFO_SUCCESS,
      payload: data.admin
    });
  } catch (error) {
    dispatch({
      type: GET_OUTLET_INFO_FAIL,
      payload: error.response?.data.message || "Something went wrong"
    });
  }
};

// Clear errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
