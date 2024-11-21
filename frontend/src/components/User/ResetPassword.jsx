import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userAction";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./ResetPassword.css";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { error, loading, success } = useSelector((state) => state.forgotPassword);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Password reset successfully!");
      navigate("/login");
    }
  }, [dispatch, error, success]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await dispatch(resetPassword(token, password, confirmPassword));

    // Reset password fields after success or failure
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-top">
        <span className="material-symbols-outlined cursor-pointer" onClick={handleBack}>
          arrow_back
        </span>
        <p>Reset Password</p>
        <div></div>
      </div>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="reset-password-form">
        <TextField
          type="password"
          label="New Password"
          variant="outlined"
          required
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
