import React, { useEffect, useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import "./LoginRegisterForm.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearErrors } from "../../actions/userAction";
import { toast } from "react-hot-toast";

const LoginRegisterForm = () => {
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [toastShown, setToastShown] = useState(false); // Flag for toast message

  const switchForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      phone: event.target["login-phone"].value,
      password: event.target["login-password"].value,
    };

    await dispatch(login(formData));
  };

  const redirecting = location.search.includes("redirect=")
    ? location.search.split("=")[1]
    : "/account";

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    } else if (isAuthenticated && !toastShown) {
      setToastShown(true);
      toast.success("Logged in successfully");
      if (redirecting === "shipping") {
        navigate("/shipping");
      } else {
        navigate(redirecting);
      }
    }
  }, [error, isAuthenticated, dispatch, navigate, redirecting, toastShown]);

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      name: event.target["register-name"].value,
      email: event.target["register-email"].value,
      phone: event.target["register-phone"].value,
      password: event.target["register-password"].value,
    };

    await dispatch(register(formData));
  };

  return (
    <div className="main-login">
           {" "}
      <div className="form-container">
               {" "}
        <div className="slider-container">
                   {" "}
          <div
            className={`slider ${isLogin ? "slide-left" : "slide-right"}`}
          ></div>
                   {" "}
          <h2
            className={`login-register-header ${
              isLogin ? "slide-left" : "slide-right"
            }`}
          >
                        {isLogin ? "Login" : "Register"}         {" "}
          </h2>
                 {" "}
        </div>
               {" "}
        <form
          onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
          className={`form ${isLogin ? "slide-left" : "slide-right"}`}
        >
                   {" "}
          {!isLogin && (
            <>
                           {" "}
              <TextField
                id="register-name"
                name="register-name"
                label="Name"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                placeholder="Enter your name"
              />
                           {" "}
              <TextField
                id="register-email"
                name="register-email"
                label="Email"
                type="email"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                placeholder="Enter your email"
              />
                           {" "}
              <TextField
                id="register-phone"
                name="register-phone"
                label="Phone"
                type="tel"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                placeholder="Enter your phone number"
              />
                           {" "}
              <TextField
                id="register-password"
                name="register-password"
                label="Password"
                type="password"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                placeholder="Set a password"
              />
                         {" "}
            </>
          )}
                   {" "}
          {isLogin && (
            <>
                           {" "}
              <TextField
                id="login-phone"
                name="login-phone"
                label="Phone"
                type="tel"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                placeholder="Enter your phone number"
              />
                           {" "}
              <TextField
                id="login-password"
                name="login-password"
                label="Password"
                type="password"
                variant="outlined"
                required
                fullWidth
                margin="normal"
                placeholder="Enter your password"
              />
                           {" "}
              <Link to="/password/forgot" className="p-1 text-right">
                                Forgot Password?              {" "}
              </Link>
                         {" "}
            </>
          )}
                   {" "}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="mt-3 p-2"
            disableElevation
            disabled={loading}
            endIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
                        {isLogin ? "Login" : "Register"}         {" "}
          </Button>
                 {" "}
        </form>
               {" "}
        <div className="button-box">
                   {" "}
          <Button onClick={switchForm} variant="text" color="secondary">
                       {" "}
            {isLogin ? "Not an account? Register" : "Already registered? Login"}
                     {" "}
          </Button>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default LoginRegisterForm;
