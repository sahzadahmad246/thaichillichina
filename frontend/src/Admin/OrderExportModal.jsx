import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector, useDispatch } from "react-redux";
import { getSingleUser } from "../actions/adminAction";

const OrderReportGenerator = ({ isOpen, onClose, orders, outlet }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { users } = useSelector((state) => state.singleUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        if (!users[order.user]) {
          dispatch(getSingleUser(order.user));
        }
      });
    }
  }, [orders, users, dispatch]);

  const filterOrdersByDateRange = () => {
    if (!startDate || !endDate) return orders;

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const generatePDF = () => {
    setIsGenerating(true);
    const filteredOrders = filterOrdersByDateRange();
    console.log(filteredOrders);
    console.log(filteredOrders.taxPrice);
    const doc = new jsPDF();

    // Title and Logo
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER REPORT", 14, 20);
    doc.addImage(outlet.outletLogo?.url, "PNG", 150, 10, 25, 15);

    // Line below header
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(14, 30, 196, 30);

    // Box for outlet info and summary
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 35, 182, 40, "F");

    // Outlet Information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Outlet: ${outlet.outletName}`, 20, 43); // 38 + 5
    doc.text(`Address: ${outlet.address}`, 20, 49); // 44 + 5
    doc.text(`GST: ${outlet.gst}`, 20, 55); // 50 + 5
    doc.text(`Phone: ${outlet.altPhone}`, 20, 61); // 56 + 5

    // Summary
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", 110, 43); // 38 + 5
    doc.setFont("helvetica", "normal");
    doc.text(
      `Date Range: ${format(startDate, "dd/MM/yyyy")} - ${format(
        endDate,
        "dd/MM/yyyy"
      )}`,
      110,
      49 // 44 + 5
    );
    doc.text(`Total Orders: ${filteredOrders.length}`, 110, 55); // 50 + 5

    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    const totalTax = filteredOrders.reduce(
      (sum, order) => sum + (order.taxPrice || 0),
      0
    );
    console.log(totalTax);
    doc.text(`Total Revenue (INR): ${Math.round(totalRevenue)}`, 110, 61);
    doc.text(`Total Tax (INR): ${Math.round(totalTax)}`, 110, 67);

    // Orders Table

    doc.autoTable({
      head: [
        [
          "Order ID",
          "Name",
          "Phone",
          "Address",
          "Date",
          "Total (INR)",
          "Status",
        ],
      ],
      body: filteredOrders.map((order) => [
        order._id,
        users[order.user] ? users[order.user].name : "NA",
        order.deliveryInfo.phone,
        `${order.deliveryInfo.address}, ${order.deliveryInfo.city}, ${order.deliveryInfo.pincode}`,
        format(new Date(order.createdAt), "dd/MM/yyyy"),
        `${order.totalPrice.toFixed(2)}`,
        order.orderStatus,
      ]),
      startY: 85,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [0, 0, 0], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "This is an electronically generated report and does not require a signature.",
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
    }

    doc.save(
      `order-report-${format(startDate, "yyyy-MM-dd")}-to-${format(
        endDate,
        "yyyy-MM-dd"
      )}.pdf`
    );
    setIsGenerating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Generate Order Report</h2>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>
            <div className="flex-1  sm:mt-0">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={generatePDF}
            disabled={isGenerating || !startDate || !endDate}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              (isGenerating || !startDate || !endDate) &&
              "opacity-50 cursor-not-allowed"
            }`}
          >
            {isGenerating ? "Generating PDF..." : "Generate PDF Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReportGenerator;
