import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearErrors } from "../../actions/userAction";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Lock, Loader2 } from 'lucide-react';

const LoginRegisterForm = () => {
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [toastShown, setToastShown] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-3 sm:p-10 rounded-xl border">
        <div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
            {isLogin ? "Login " : "Create account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md  -space-y-px">
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label htmlFor="register-name" className="sr-only">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="register-name"
                      name="register-name"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Name"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="register-email" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="register-email"
                      name="register-email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="mb-4">
              <label htmlFor={isLogin ? "login-phone" : "register-phone"} className="sr-only">
                Phone number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id={isLogin ? "login-phone" : "register-phone"}
                  name={isLogin ? "login-phone" : "register-phone"}
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div>
              <label htmlFor={isLogin ? "login-password" : "register-password"} className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id={isLogin ? "login-password" : "register-password"}
                  name={isLogin ? "login-password" : "register-password"}
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/password/forgot" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : null}
              {isLogin ? "Sign in" : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button onClick={switchForm} className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500">
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterForm;

