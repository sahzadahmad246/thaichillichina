import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../actions/userAction";
import { useNavigate } from "react-router-dom";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstant";
import "./UpdatePassword.css";
import { toast } from "react-hot-toast";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, user, isPasswordUpdated } = useSelector(
    (state) => state.user
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    if (isPasswordUpdated) {
      toast.success("Password updated successfully!");
      dispatch({ type: UPDATE_PASSWORD_RESET });
      navigate("/account");
    }
  }, [dispatch, error, isPasswordUpdated]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await dispatch(
      updatePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      })
    );

    // Reset password fields after success or failure
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="update-password-container">
      <div className="update-password-top">
        <span className="material-symbols-outlined cursor-pointer" onClick={handleBack}>
          arrow_back
        </span>
        <p>Update Password</p>
        <img src={user.avatar && user.avatar.url} alt="Profile" />
      </div>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="update-password-form">
        <TextField
          type="password"
          label="Current Password"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          type="password"
          label="New Password"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          type="password"
          label="Confirm New Password"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disableElevation
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
