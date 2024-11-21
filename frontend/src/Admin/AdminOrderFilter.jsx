import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSingleUser } from "../actions/adminAction";
import { format, isToday } from "date-fns";

const AdminFilteredOrders = ({
  orders,
  activeStatus,
  setFilteredOrders,
  users,
  searchTerm,
}) => {
  const dispatch = useDispatch();

  // Fetch user data for orders
  useEffect(() => {
    if (!orders) return;

    const fetchMissingUserData = async () => {
      const uniqueUserIds = [...new Set(orders.map((order) => order.user))];

      // Only fetch data for users we don't already have
      const missingUserIds = uniqueUserIds.filter((userId) => !users[userId]);

      // Fetch user data for missing users
      missingUserIds.forEach((userId) => {
        dispatch(getSingleUser(userId));
      });
    };

    fetchMissingUserData();
  }, [orders, users, dispatch]);

  // Filter and sort orders
  useEffect(() => {
    if (!orders) return;

    const filtered = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const isActiveOrder = !["Delivered", "Rejected", "cancelled"].includes(
          order.orderStatus
        );

        // Check if order is from today or still active
        const shouldShowOrder = isToday(orderDate) || isActiveOrder;
        if (!shouldShowOrder) return false;

        // Status filtering
        if (activeStatus === "Undelivered") {
          return (
            order.orderStatus === "cancelled" ||
            order.orderStatus === "Rejected"
          );
        } else {
          return order.orderStatus === activeStatus;
        }
      })
      .filter((order) => {
        // Search filtering
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();

        // Search by user name
        if (users[order.user]) {
          const userName = users[order.user].name.toLowerCase();
          if (userName.includes(searchLower)) return true;
        }

        // Search by order ID
        if (order._id.toLowerCase().includes(searchLower)) return true;

        // Search by delivery address
        if (order.deliveryInfo) {
          const address =
            `${order.deliveryInfo.address} ${order.deliveryInfo.city} ${order.deliveryInfo.pincode}`.toLowerCase();
          if (address.includes(searchLower)) return true;
        }

        return false;
      });

    // Sort by creation date (newest first)
    const sortedFiltered = filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setFilteredOrders(sortedFiltered);
  }, [orders, activeStatus, users, searchTerm, setFilteredOrders]);

  // Helper function to render user info
  const renderUserInfo = (order) => {
    const user = users[order.user];

    if (!user) {
      return (
        <div className="user-info-skeleton">
          <div className="animate-pulse flex items-center">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="ml-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="user-info flex items-center">
        {user.avatar ? (
          <img
            src={user.avatar.url}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {user.name.charAt(0)}
          </div>
        )}
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
        </div>
      </div>
    );
  };

  return null;
};

export default AdminFilteredOrders;