import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { subDays, subMonths, format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { myOrders, clearErrors } from "../actions/orderAction";
import { toast } from "react-toastify";

const TowerGraph = ({ filter, dataType }) => {
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState([]);
  const { error, orders, loading } = useSelector((state) => state.myOrders);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, error]);

  useEffect(() => {
    const today = new Date();
    const salesData = [];
    const ordersData = [];

    if (orders && orders.length > 0) {
      const dateMap = {};

      orders.forEach((order) => {
        const date = format(new Date(order.createdAt), "yyyy-MM-dd");
        if (!dateMap[date]) {
          dateMap[date] = { sales: 0, orders: 0 };
        }
        dateMap[date].sales += order.totalPrice;
        dateMap[date].orders += 1;
      });

      for (let i = 365; i >= 0; i--) {
        const date = format(subDays(today, i), "yyyy-MM-dd");
        salesData.push({
          date,
          sales: dateMap[date]?.sales || 0,
        });
        ordersData.push({
          date,
          orders: dateMap[date]?.orders || 0,
        });
      }
    }

    let filtered = dataType === "sales" ? salesData : ordersData;

    if (filter === "7D") {
      filtered = filtered.filter((d) => new Date(d.date) >= subDays(today, 7));
    } else if (filter === "28D") {
      filtered = filtered.filter((d) => new Date(d.date) >= subDays(today, 28));
    } else if (filter === "3M") {
      filtered = filtered.filter(
        (d) => new Date(d.date) >= subMonths(today, 3)
      );
    } else if (filter === "1Y") {
      filtered = filtered.filter(
        (d) => new Date(d.date) >= subMonths(today, 12)
      );
    } else if (filter === "Today") {
      filtered = filtered.filter((d) => d.date === format(today, "yyyy-MM-dd"));
    }

    setFilteredData(filtered);
  }, [filter, dataType, orders]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={filteredData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataType} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TowerGraph;
