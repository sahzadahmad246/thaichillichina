import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";


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
              <p>Login to access your account</p>
              <Link to="/login">Login</Link>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Account;
