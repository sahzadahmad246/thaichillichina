import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearErrors } from "../../actions/userAction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, message } = useSelector(
    (state) => state.forgotPassword
  );
  const { user } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
      setEmailSent(true);

      // Set timeout to reset emailSent after 15 seconds
      const timer = setTimeout(() => {
        setEmailSent(false);
      }, 15000);

      // Clear timeout if component unmounts or emailSent changes
      return () => clearTimeout(timer);
    }
  }, [dispatch, error, message]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(forgotPassword(email));
  };

  const handleResend = () => {
    dispatch(forgotPassword(email));
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-top">
        <span
          className="material-symbols-outlined cursor-pointer"
          onClick={handleBack}
        >
          arrow_back
        </span>
        <p>Forgot Password</p>
        <div></div>
      </div>
      {error && <p className="error-message">{error}</p>}
      {!emailSent ? (
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              "Send Reset Link"
            )}
          </Button>
        </form>
      ) : (
        <div className="success-message">
          <CheckCircleIcon className="success-icon" style={{ fontSize: 40, color: 'green' }} />
          <p>Email sent to {email}. Please check your inbox.</p>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Resend Email"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
