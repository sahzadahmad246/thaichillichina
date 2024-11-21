import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import AdminNav from "./AdminNav";
import DashboardTop from "./DashboardTop";
import TowerGraph from "./TowerGraph";
import { useSelector, useDispatch } from "react-redux";
import { BiUpArrow, BiDownArrow } from "react-icons/bi";
import { getAllUsers, clearErrors } from "../actions/adminAction";
import Loader from "../components/Layout/Loader";

const Dashboard = () => {
  const [filter, setFilter] = useState("Today");
  const [dataType, setDataType] = useState("sales");
  const dispatch = useDispatch();

  const { error, orders } = useSelector((state) => state.myOrders);
  const { users, loading } = useSelector((state) => state.allUsers);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [salesChange, setSalesChange] = useState(0);
  const [ordersChange, setOrdersChange] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const filterOptions = ["Today", "7D", "28D", "3M", "1Y"];
  const dataTypes = ["sales", "orders"];

  useEffect(() => {
    if (orders && orders.length > 0) {
      const now = new Date();
      let filtered = [];

      switch (filter) {
        case "Today":
          filtered = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate.getDate() === now.getDate() &&
              orderDate.getMonth() === now.getMonth() &&
              orderDate.getFullYear() === now.getFullYear()
            );
          });
          break;
        case "7D":
          filtered = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const diffTime = Math.abs(now - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          });
          break;
        case "28D":
          filtered = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const diffTime = Math.abs(now - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 28;
          });
          break;
        case "3M":
          filtered = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const diffTime = Math.abs(now - orderDate);
            const diffMonths =
              now.getMonth() -
              orderDate.getMonth() +
              12 * (now.getFullYear() - orderDate.getFullYear());
            return diffMonths <= 3;
          });
          break;
        case "1Y":
          filtered = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getFullYear() === now.getFullYear();
          });
          break;
        default:
          filtered = orders;
      }

      setFilteredOrders(filtered);

      const total = filtered.reduce((sum, order) => sum + order.totalPrice, 0);
      setTotalSales(total);
      setTotalOrders(filtered.length);

      // Calculate percentage change for sales
      const totalAll = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const salesDiff = total - totalAll;
      const salesChangePercent = ((salesDiff / totalAll) * 100).toFixed(2);
      setSalesChange(salesChangePercent);

      // Calculate percentage change for orders
      const ordersDiff = filtered.length - orders.length;
      const ordersChangePercent = ((ordersDiff / orders.length) * 100).toFixed(
        2
      );
      setOrdersChange(ordersChangePercent);
    }
  }, [orders, filter]);

  useEffect(() => {
    dispatch(getAllUsers());
    if (error) {
      dispatch(clearErrors);
    }
  }, [dispatch]);

  useEffect(() => {
    if (users && users.length > 0) {
      const now = new Date();
      let filtered = [];

      switch (filter) {
        case "Today":
          filtered = users.filter((user) => {
            const userDate = new Date(user.createdAt);
            return (
              userDate.getDate() === now.getDate() &&
              userDate.getMonth() === now.getMonth() &&
              userDate.getFullYear() === now.getFullYear()
            );
          });
          break;
        case "7D":
          filtered = users.filter((user) => {
            const userDate = new Date(user.createdAt);
            const diffTime = Math.abs(now - userDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          });
          break;
        case "28D":
          filtered = users.filter((user) => {
            const userDate = new Date(user.createdAt);
            const diffTime = Math.abs(now - userDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 28;
          });
          break;
        case "3M":
          filtered = users.filter((user) => {
            const userDate = new Date(user.createdAt);
            const diffTime = Math.abs(now - userDate);
            const diffMonths =
              now.getMonth() -
              userDate.getMonth() +
              12 * (now.getFullYear() - userDate.getFullYear());
            return diffMonths <= 3;
          });
          break;
        case "1Y":
          filtered = users.filter((user) => {
            const userDate = new Date(user.createdAt);
            return userDate.getFullYear() === now.getFullYear();
          });
          break;
        default:
          filtered = users;
      }

      setFilteredUsers(filtered);
    }
  }, [users, filter]);

  return (
    <>
      <div className="dashboard-main">
        <DashboardTop />
        <div className="dashboard">
          <div className="dashboard-left">
            <AdminNav />
          </div>
          <div className="dashboard-right">
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="dashboard-right-1">
                  <h1>Outlet Overview</h1>
                  <select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                  >
                    {dataTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="dashboard-right-1-1">
                    {filterOptions.map((option) => (
                      <span
                        key={option}
                        className={filter === option ? "active" : ""}
                        onClick={() => setFilter(option)}
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="dashboard-right-2">
                  <TowerGraph filter={filter} dataType={dataType} />
                </div>
                <div className="dashboard-right-3">
                  <div className="dashboard-right-3-1">
                    <h1 className="text-slate-500">Total Sales</h1>
                    <span className="d-flex  items-center justify-center mt-2">
                      <span className="fw-bold fs-5">{totalSales}</span>
                      <span>
                        {ordersChange < 0 ? (
                          <span className=" d-flex  items-center ps-2 text-danger">
                            <BiDownArrow /> {Math.abs(salesChange)}%
                          </span>
                        ) : (
                          <span className=" d-flex  items-center ps-2 text-success">
                            <BiUpArrow /> {salesChange}%
                          </span>
                        )}
                      </span>
                    </span>
                  </div>
                  <div className="dashboard-right-3-1">
                    <h1 className="text-slate-500">Total Orders</h1>
                    <span className="d-flex  items-center justify-center mt-2">
                      <span className="fw-bold fs-5">{totalOrders}</span>
                      <span>
                        {ordersChange < 0 ? (
                          <span className=" d-flex  items-center ps-2 text-danger">
                            <BiDownArrow /> {Math.abs(ordersChange)}%
                          </span>
                        ) : (
                          <span className=" d-flex  items-center ps-2 text-success">
                            <BiUpArrow /> {ordersChange}%
                          </span>
                        )}
                      </span>
                    </span>
                  </div>
                  <div className="dashboard-right-3-1">
                    <h1 className="text-slate-500">Total Users</h1>
                    <span className="d-flex  items-center justify-center mt-2">
                      <span className="fw-bold fs-5">
                        {filteredUsers.length}
                      </span>
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
