import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import homeBanner from ".././images/homeBanner.png";

const LiveOrder = ({ liveOrders, showLiveOrder }) => {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const liveOrderRef = useRef(null);

  useEffect(() => {
    if (!liveOrders || liveOrders.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentOrderIndex((prevIndex) =>
        prevIndex === liveOrders.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, [liveOrders]);

  if (!liveOrders || liveOrders.length === 0) return null;

  const currentOrder = liveOrders[currentOrderIndex];

  return (
    <div
      ref={liveOrderRef}
      className={`fixed left-1/2 transform -translate-x-1/2 bottom-16 z-50 w-full md:w-1/2 ${
        showLiveOrder ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300`}
    >
      <div className="flex flex-col w-full px-2 py-1 bg-white md:bg-transparent border border-gray-200 rounded-none md:rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-2">
          <div className="flex flex-col flex-grow">
            <h3 className="text-sm font-semibold truncate max-w-[200px]">
              {currentOrder.orderItems[0].name}
            </h3>
            <span className="text-xs text-green-600">
              your order is {currentOrder.orderStatus}
            </span>
          </div>

          <Link
            to={`/account/orders/${currentOrder._id}`}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors duration-200"
          >
            View Order
          </Link>
        </div>

        {liveOrders.length > 1 && (
          <div className="flex justify-center items-center space-x-1 pb-2">
            {liveOrders.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === currentOrderIndex ? "bg-red-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOrder;