import React, { useState, useEffect } from "react";
import "./DashboardTop.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { logout } from "../actions/userAction";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IoIosNotificationsOutline } from "react-icons/io";
import { getOutletInfo, updateOutletInfo } from "../actions/adminAction";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const DashboardTop = () => {
  const { user } = useSelector((state) => state.user);
  const { outlet } = useSelector((state) => state.getOutletInfo);
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("Open");

  useEffect(() => {
    dispatch(getOutletInfo());
  }, [dispatch]);

  useEffect(() => {
    if (outlet) {
      setIsOnline(outlet.outletStatus === "Open");
    }
  }, [outlet]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSwitchChange = (event) => {
    const status = event.target.checked ? "Open" : "Closed";
    setNewStatus(status);
    setConfirmDialogOpen(true);
  };

  const handleConfirm = () => {
    dispatch(updateOutletInfo(outlet._id, { outletStatus: newStatus }));
    setIsOnline(newStatus === "Open");
    setConfirmDialogOpen(false);
  };

  const handleCancel = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-top">
        <div className="dashboard-top-left">
          <Link>Thai Chilli China</Link>
        </div>
        <div className="dashboard-top-right">
          <FormControlLabel
            className="toggle-online"
            control={
              <Android12Switch
                checked={isOnline}
                onChange={handleSwitchChange}
              />
            }
            label={isOnline ? "Online" : "Offline"}
          />
          <div className="admin-notfication">
            <IoIosNotificationsOutline size={35} />
          </div>
          <div className="admin-account" onClick={toggleDropdown}>
            <img src={user?.avatar.url} alt="User Avatar" />
            <span>{user?.name}</span>
            {showDropdown ? <FaCaretUp /> : <FaCaretDown />}
            {showDropdown && (
              <Box className="admin-dropdown-box">
                <div className="admin-dropdown-box-1">
                  <img src={user?.avatar.url} alt="User Avatar" />
                  <span className="px-2">
                    <h4 className="py-1 text-neutral-700">{user?.name}</h4>
                    <h4 className="py-1 text-neutral-700">{user?.phone}</h4>
                  </span>
                </div>
                <h4 className="py-2 text-neutral-700">{user?.email}</h4>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancel}
      >
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the outlet status to {newStatus}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            No
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashboardTop;
