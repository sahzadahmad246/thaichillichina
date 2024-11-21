import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon } from "../actions/couponAction";
import { COUPON_CREATE_RESET } from "../constants/couponConstant";
const CreateOffer = () => {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");

  const dispatch = useDispatch();

  const couponCreate = useSelector((state) => state.couponCreate);
  const { user } = useSelector((state) => state.user);
  const { loading, error, success } = couponCreate;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createCoupon({
        code,
        discountType,
        discountValue,
        expiryDate,
      })
    );
  };
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch({ type: COUPON_CREATE_RESET });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  return (
    <div className="flex my-3 flex-col items-center justify-center">
      {loading && <p className="text-center text-blue-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {success && (
        <p className="text-center text-green-500">
          Coupon created successfully!
        </p>
      )}
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Coupon Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Discount Type</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          >
            <option value="percent">Percent</option>
            <option value="amount">Amount</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Discount Value</label>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            "Create Coupon"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateOffer;
