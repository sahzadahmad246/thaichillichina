import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { logout, clearErrors } from "../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { LayoutDashboard, User, ShoppingBag, Lock, LogOut } from 'lucide-react';

const AccountNav = () => {
  const { error, loading, user, isAuthenticated, token } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
  }, [error, dispatch, user]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 p-3 transition-colors duration-200  ${
          isActive
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      <Icon className="w-6 h-6" />
      <span>{children}</span>
    </NavLink>
  );

  return (
    <nav className="bg-white">
      {isAdmin && (
        <NavItem to="/admin/orders" icon={LayoutDashboard}>
          Dashboard
        </NavItem>
      )}
      <NavItem to="/account/profile" icon={User}>
        Profile
      </NavItem>
      <NavItem to="/account/orders" icon={ShoppingBag}>
        Orders
      </NavItem>
      <NavItem to="/password/update" icon={Lock}>
        Update Password
      </NavItem>
      <button
        onClick={handleLogout}
        className="flex items-center  ms-3 space-x-4 w-full p-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 "
      >
        <LogOut className="w-6 h-6" />
        <span>Logout</span>
      </button>
     
    </nav>
  );
};

export default AccountNav;

