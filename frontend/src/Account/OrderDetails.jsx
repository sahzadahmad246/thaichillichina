import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderDetails, clearErrors } from "../actions/orderAction";
import { getOutletInfo } from "../actions/adminAction";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  HelpCircle,
  Box,
  Clock,
  MapPin,
  FileDown,
  Share2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  X,
  ShoppingBag,
} from "lucide-react";

import Loader from "../components/Layout/Loader";
import MetaData from "../components/Home/MetaData";
import OrderStatusStepper from "../Admin/OrderStatusStepper";
import InvoicePDF from "./InvoicePDF";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { outlet } = useSelector((state) => state.getOutletInfo);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(id));
    dispatch(getOutletInfo());
    setIsInitialLoad(false);
  }, [dispatch, id, error]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "";
      const date = new Date(dateString);
      return format(date, "hh:mm a 'on' dd-MMMM-yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "Placed":
        return "Order is placed, please wait for restaurant to accept it.";
      case "Accepted":
        return "Order is accepted and the restaurant is preparing.";
      case "Ready":
        return "Order is ready, soon it will be dispatched.";
      case "On the way":
        return "Order is on the way.";
      case "Delivered":
        return "Your order was delivered.";
      case "Rejected":
        return "Oops! Order rejected. Call restaurant to know why.";
      case "cancelled":
        return "Order was cancelled";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className="text-green-500" />;
      case "Rejected":
      case "cancelled":
        return <XCircle className="text-red-500" />;
      default:
        return <AlertCircle className="text-yellow-500" />;
    }
  };

  const generateShareText = () => {
    if (!order) return "";

    const items = order.orderItems.map(item => `${item.name} (${item.quantity})`).join(", ");
    return `Order #${order._id}\nStatus: ${order.orderStatus}\nItems: ${items}\nTotal: ₹${order.totalPrice}\nPlaced on: ${formatDate(order.createdAt)}`;
  };

  const handleShare = (platform) => {
    const text = generateShareText();
    let url;

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      default:
        navigator.clipboard.writeText(text);
        toast.success("Order details copied to clipboard!");
        setIsShareDialogOpen(false);
        return;
    }

    window.open(url, '_blank');
    setIsShareDialogOpen(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <MetaData title={`Order Id #${order?._id}`} />
      <div className="max-w-7xl mx-auto p-0 sm:p-6 sm:mt-2">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3  flex justify-between items-center">
            <button
              onClick={handleBack}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-xl font-semibold">Order Details</h1>
            <button
              onClick={() => (window.location.href = `tel:${outlet.altPhone}`)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <HelpCircle size={24} />
            </button>
          </div>

          <div className="p-3 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <div className="md:col-span-2 space-y-6 ">
              <InfoBox title="Order Information" className="border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    icon={<Box size={20} />}
                    title="Order ID"
                    content={`#${order?._id}`}
                  />
                  <InfoCard
                    icon={<Clock size={20} />}
                    title="Order placed at"
                    content={formatDate(order?.createdAt)}
                  />
                  <InfoCard
                    icon={getStatusIcon(order?.orderStatus)}
                    title="Order Status"
                    content={getStatusMessage(order?.orderStatus)}
                    statusColor={
                      order?.orderStatus === "Delivered"
                        ? "text-green-600"
                        : order?.orderStatus === "Rejected" ||
                          order?.orderStatus === "cancelled"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  />
                  <InfoCard
                    icon={<MapPin size={20} />}
                    title={
                      order?.orderStatus === "Delivered"
                        ? "Delivered to"
                        : "Delivering to"
                    }
                    content={`${order?.deliveryInfo?.address}, ${order?.deliveryInfo?.city}, ${order?.deliveryInfo?.pincode}`}
                  />
                  <InfoCard
                    icon={<CreditCard size={20} />}
                    title="Payment"
                    content={order?.paymentInfo?.status || "N/A"}
                  />
                </div>
              </InfoBox>

              <InfoBox title="Order Timeline">
                <OrderStatusStepper
                  statusHistory={order.statusHistory}
                  createdAt={order.createdAt}
                />
              </InfoBox>

              <InfoBox title="Items you ordered">
                <ul className="divide-y divide-gray-200">
                  {order?.orderItems &&
                    order.orderItems.map((item) => (
                      <motion.li
                        key={item.product}
                        className="py-4 flex justify-between items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link to={`/product/${item.product}`} className="flex items-center space-x-4">
                          <img
                            src={item.image.url}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <span className="text-sm text-gray-800">
                            {item.name}
                          </span>
                        </Link>
                        <span className="text-sm text-gray-600">
                          {item.quantity} x ₹{item.price} = ₹
                          {item.quantity * item.price}
                        </span>
                      </motion.li>
                    ))}
                </ul>
              </InfoBox>
            </div>

            <div className="space-y-6">
              <PaymentInfoBox title="Payment Info">
                <div className="space-y-2">
                  <PaymentInfoRow label="GST" amount={order?.taxPrice} />
                  <PaymentInfoRow
                    label="Delivery Charge"
                    amount={order?.deliveryPrice}
                  />
                  <PaymentInfoRow label="Discount" amount={order?.discount} />
                  <PaymentInfoRow
                    label="Total amount"
                    amount={order?.totalPrice}
                    isBold
                  />
                </div>
              </PaymentInfoBox>

              <div className="flex flex-col space-y-4">
                <PDFDownloadLink
                  document={<InvoicePDF order={order} outlet={outlet} />}
                  fileName={`invoice_${order._id}.pdf`}
                >
                  {({ blob, url, loading, error }) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors w-full"
                      disabled={loading}
                    >
                      <FileDown size={20} />
                      <span>{loading ? "Loading..." : "Download Invoice"}</span>
                    </motion.button>
                  )}
                </PDFDownloadLink>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors w-full"
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  <Share2 size={20} />
                  <span>Share Order</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isShareDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Share Order</h2>
                <button onClick={() => setIsShareDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <button onClick={() => handleShare('whatsapp')} className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
                  Share on WhatsApp
                </button>
                <button onClick={() => handleShare('telegram')} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Share on Telegram
                </button>
                <button onClick={() => handleShare('twitter')} className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition-colors">
                  Share on Twitter
                </button>
                <button onClick={() => handleShare('copy')} className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors">
                  Copy to Clipboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoBox = ({ title, children }) => (
  <div className="bg-white p-3 rounded-lg border border-red-700 ">
    <h2 className="text-lg font-semibold mb-4 flex items-center">
      <ShoppingBag className="mr-2 text-indigo-600" size={20} />
      {title}
    </h2>
    {children}
  </div>
);
const PaymentInfoBox = ({ title, children }) => (
  <div className="bg-white p-3 rounded-lg border border-red-700 ">
    <h2 className="text-lg font-semibold mb-4 flex items-center">
      <CreditCard className="mr-2 text-indigo-600" size={20} />
      {title}
    </h2>
    {children}
  </div>
);

const InfoCard = ({ icon, title, content, statusColor }) => (
  <div className="flex items-center space-x-3">
    <div className="text-indigo-600">{icon}</div>
    <div>
      <h3 className="text-xs font-medium text-gray-500">{title}</h3>
      <p className={`p-0 text-sm ${statusColor || "text-gray-900"}`}>
        {content}
      </p>
    </div>
  </div>
);

const PaymentInfoRow = ({ label, amount, isBold = false }) => (
  <div
    className={`flex justify-between text-sm ${isBold ? "font-semibold" : ""}`}
  >
    <span className="text-gray-600">{label}</span>
    <span className="text-gray-900">₹{amount}</span>
  </div>
);

export default OrderDetails;

