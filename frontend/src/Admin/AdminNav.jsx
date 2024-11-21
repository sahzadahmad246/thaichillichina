import React from "react";
import "./DashboardTop.css";
import { Link, useLocation } from 'react-router-dom';
import { IoBagOutline } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { PiInfoLight } from "react-icons/pi";
import { VscHistory } from "react-icons/vsc";
import { MdDashboard } from "react-icons/md";

const AdminNav = () => {
  const location = useLocation();
  
  const getActiveClass = (path) => {
    return location.pathname === path ? "admin-active" : "";
  };

  return (
    <div>
      <Link to="/admin/orders" className={getActiveClass("/admin/orders")}>
        <IoBagOutline size={25} />
        <span className="ps-2">Orders</span>
      </Link>
      <Link to="/admin/dashboard" className={getActiveClass("/admin/dashboard")}>
        <MdDashboard size={25} />
        <span className="ps-2">Dashboard</span>
      </Link>
      <Link to="/admin/menu" className={getActiveClass("/admin/menu")}>
        <MdOutlineRestaurantMenu size={25} />
        <span className="ps-2">Menu</span>
      </Link>
      <Link to="/admin/order-history" className={getActiveClass("/admin/order-history")}>
        <VscHistory size={25} />
        <span className="ps-2">Order History</span>
      </Link>
      <Link to="/admin/offers" className={getActiveClass("/admin/offers")}>
        <CiDiscount1 size={25} />
        <span className="ps-2">Offers</span>
      </Link>
      <Link to="/admin/outlet-info" className={getActiveClass("/admin/outlet-info")}>
        <PiInfoLight size={25} />
        <span className="ps-2">Outlet info</span>
      </Link>
    </div>
  );
};

export default AdminNav;
