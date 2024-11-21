import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCoupons,
  expireCoupon,
  deleteCoupon,
} from "../actions/couponAction";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import CreateOffer from "./CreateOffer";
import { COUPON_CREATE_RESET } from "../constants/couponConstant";
import { FaPlusCircle, FaEllipsisV } from "react-icons/fa";
import Loader from "../components/Layout/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";

const AdminOffers = () => {
  const dispatch = useDispatch();
  const { loading, coupons, error } = useSelector((state) => state.couponList);
  const {
    loading: couponCreationLoading,
    error: couponCreationError,
    success: couponCreationSuccess,
  } = useSelector((state) => state.couponCreate);
  const {
    loading: expireLoading,
    success: expireSuccess,
    error: expireError,
  } = useSelector((state) => state.couponExpire);
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    error: deleteError,
  } = useSelector((state) => state.couponDelete);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // Fetch all coupons when the component mounts
  useEffect(() => {
    dispatch(getAllCoupons());
    if (deleteSuccess || expireSuccess) {
      dispatch(getAllCoupons());
    }
  }, [dispatch, deleteSuccess, expireSuccess]);

  // Hide the popup if coupon creation is successful
  useEffect(() => {
    if (couponCreationSuccess) {
      setShowCreateOffer(false);
      dispatch({ type: COUPON_CREATE_RESET });
    }
  }, [couponCreationSuccess, dispatch]);

  // Handle Mark Expire and Delete actions
  const handleActionClick = (event, coupon) => {
    setAnchorEl(event.currentTarget);
    setCurrentCoupon(coupon);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMarkExpire = () => {
    dispatch(expireCoupon(currentCoupon._id));
    handleCloseMenu();
  };

  const handleDeleteCoupon = () => {
    dispatch(deleteCoupon(currentCoupon._id));
    handleCloseMenu();
  };

  // Show toast alerts
  useEffect(() => {
    if (expireSuccess) {
      setAlert({
        open: true,
        message: "Coupon marked as expired",
        severity: "success",
      });
    }
    if (expireError) {
      setAlert({ open: true, message: expireError, severity: "error" });
    }
    if (deleteSuccess) {
      setAlert({
        open: true,
        message: "Coupon deleted successfully",
        severity: "success",
      });
    }
    if (deleteError) {
      setAlert({ open: true, message: deleteError, severity: "error" });
    }
  }, [expireSuccess, expireError, deleteSuccess, deleteError]);

  const handleCloseAlert = () => {
    setAlert({ open: false, message: "", severity: "" });
  };

  return (
    <div className="dashboard-main">
      <DashboardTop />
      <div className="dashboard">
        <div className="dashboard-left">
          <AdminNav />
        </div>
        <div className="dashboard-right p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Coupons</h2>
            <Button
              onClick={() => setShowCreateOffer(true)}
              variant="contained"
              color="primary"
              startIcon={<FaPlusCircle />}
            >
              Create Offer
            </Button>
          </div>

          {loading ? (
            <Loader/>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Discount Value</TableCell>
                    <TableCell>Discount Type</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell> {/* New Actions Column */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coupons?.map((coupon) => (
                    <TableRow key={coupon._id}>
                      <TableCell>{coupon.code}</TableCell>
                      <TableCell>{coupon.discountValue}</TableCell>
                      <TableCell>{coupon.discountType}</TableCell>
                      <TableCell>
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{coupon.status}</TableCell>
                      <TableCell>
                        <Button
                          onClick={(e) => handleActionClick(e, coupon)}
                          startIcon={<FaEllipsisV />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Actions Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleMarkExpire}>Mark Expire</MenuItem>
            <MenuItem onClick={handleDeleteCoupon}>Delete</MenuItem>
          </Menu>

          {/* Create Offer popup modal */}
          {showCreateOffer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <button
                  onClick={() => setShowCreateOffer(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                  &times;
                </button>
                <CreateOffer />
                {couponCreationLoading && <p>Creating coupon...</p>}
                {couponCreationError && (
                  <p className="text-red-500">{couponCreationError}</p>
                )}
              </div>
            </div>
          )}

          {/* Toast Alert */}
          <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            message={alert.message}
            severity={alert.severity}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOffers;
