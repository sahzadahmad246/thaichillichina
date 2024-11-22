import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";

import { motion } from "framer-motion";
import { ArrowLeft, User } from 'lucide-react';
import Loader from "../Layout/Loader";

import MetaData from "../../components/Home/MetaData";
import AccountNav from "../../Account/AccountNav";
const Account = () => {
  const { error, loading, user, isAuthenticated, token } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("profile");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const location = useLocation();
  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (!path || path === "account") {
      setActiveComponent("profile");
    } else {
      setActiveComponent(path);
    }
  }, [location]);

  const handleItemClick = (componentName) => {
    setActiveComponent(componentName);
  };
  const title = isAuthenticated ? `${user.name}'s account` : "Account";

  return (
    <div className="account-main">
      <MetaData title={title} />
      {loading ? (
        <Loader />
      ) : (
        <>
          {isAuthenticated ? (
            <>
              <div className="authed-account">
                <div className="account">
                  <div className="account-top">
                    <span
                      className="material-symbols-outlined cursor-pointer"
                      onClick={handleBack}
                    >
                      arrow_back
                    </span>
                    <p className="fs-4 text-dark">{user.name}</p>
                    <img src={user.avatar && user.avatar.url} alt="Profile" />
                  </div>
                  <div className="account-left">
                    <AccountNav />
                  </div>
                  {!isMobile && (
                    <div className="account-right d-flex justify-center ">
                      <h1 className="pt-5 fs-4  font-semibold">
                        Welcome to your Account
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-4 py-16 flex justify-center items-center"
            >
              <div className="bg-white p-8 rounded-lg border max-w-md w-full text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                >
                  <User className="text-white" size={40} />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-gray-800 mb-6 "
                >
                  Login to access your account
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/login"
                    className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg py-3 px-6 font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Account;
