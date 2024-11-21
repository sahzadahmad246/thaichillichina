// src/reducers/locationReducer.js
import { SET_LOCATION, SET_ADDRESS } from '../constants/otherConstant';

const initialState = {
  location: { lat: 51.505, lng: -0.09 }, // Default location
  address: null,
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
    case SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };
    default:
      return state;
  }
};

export default locationReducer;
