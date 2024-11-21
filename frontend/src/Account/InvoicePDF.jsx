import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register custom fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  companyInfo: {
    marginLeft: 20,
    flexGrow: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  companyDetails: {
    fontSize: 10,
    color: '#4B5563',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#3B82F6',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B5563',
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
  },
  tableCol: {
    width: "25%",
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
    color: '#4B5563',
  },
  summaryTable: {
    width: "50%",
    alignSelf: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 10,
    color: '#4B5563',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#3B82F6',
    marginTop: 5,
    paddingTop: 5,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "dd-MMMM-yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const InvoicePDF = ({ order, outlet }) => {
  if (!order || !outlet) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.invoiceTitle}>Error: Data not available</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src={outlet.outletLogo?.url || "/placeholder.svg?height=60&width=60"}
          />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{outlet.outletName}</Text>
            <Text style={styles.companyDetails}>{outlet.address || "N/A"}</Text>
            <Text style={styles.companyDetails}>GST: {outlet.gst || "N/A"}</Text>
            <Text style={styles.companyDetails}>Contact: {outlet.altPhone || "N/A"}</Text>
          </View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        <View style={styles.flexRow}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            <Text style={styles.tableCell}>Order ID: {order._id || "N/A"}</Text>
            <Text style={styles.tableCell}>Date: {formatDate(order.createdAt)}</Text>
            <Text style={styles.tableCell}>Status: {order.orderStatus || "N/A"}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={styles.tableCell}>Name: {order.user?.name || "N/A"}</Text>
            <Text style={styles.tableCell}>Email: {order.user?.email || "N/A"}</Text>
            <Text style={styles.tableCell}>Phone: {order.user?.phone || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.tableCell}>
            {order.deliveryInfo?.address || "N/A"}
          </Text>
          <Text style={styles.tableCell}>
            {order.deliveryInfo?.city || "N/A"},{" "}
            {order.deliveryInfo?.pincode || "N/A"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Item</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Quantity</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Price</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Total</Text>
              </View>
            </View>
            {order.orderItems &&
              order.orderItems.map((item) => (
                <View style={styles.tableRow} key={item.product}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.name || "N/A"}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{item.quantity || 0}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>₹{item.price || 0}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      ₹{(item.quantity || 0) * (item.price || 0)}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        <View style={[styles.section, styles.summaryTable]}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>₹{order.totalPrice - order.taxPrice - order.deliveryPrice + order.discount || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>GST</Text>
            <Text style={styles.summaryText}>₹{order.taxPrice || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Delivery Charge</Text>
            <Text style={styles.summaryText}>₹{order.deliveryPrice || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Discount</Text>
            <Text style={styles.summaryText}>-₹{order.discount || 0}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalText}>₹{order.totalPrice || 0}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for your order! We appreciate your business.
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;