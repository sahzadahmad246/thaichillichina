// OrderBill.js
import React, { useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import image from "../images/china.png";
import { format, isValid } from "date-fns";
import styles from "./OrderBillStyle";
import { getSingleUser, clearErrors } from "../actions/adminAction";
import { useDispatch, useSelector } from "react-redux";
const OrderBill = ({ order }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.singleUser);
  const { outlet } = useSelector((state) => state.getOutletInfo);
  console.log(outlet);
  useEffect(() => {
    dispatch(getSingleUser(order.user));
  }, [order]);
  const currentUser = users[order.user];
  return (
    <PDFViewer width="100%" height="400">
      <Document>
        <Page size={{ width: 80, height: "auto" }} style={styles.page}>
          <View style={styles.header}>
            <Image src={outlet.outletLogo?.url} style={styles.outletLogo} />
            <View style={styles.headerBox}>
              <Text style={styles.headerText}>{outlet.address}</Text>
              <Text style={styles.headerText}>
                Mobile No. {outlet.altPhone}, GST- {outlet.gst}
              </Text>
              <Text style={styles.headerText}>Order Id- #{order._id}</Text>
            </View>
          </View>
          <View style={styles.section0}>
            <View style={styles.section0_1}>
              <Text style={styles.section0Text}>Name: {currentUser.name}</Text>
              <Text style={styles.section0Text}>
                Date: {format(order.createdAt, "dd/MM/yyyy, 'at' hh:mm a")}
              </Text>
            </View>
            <View style={styles.section0_1}>
              <Text style={styles.section0Text}>
                Mobile: {order.deliveryInfo.phone}
              </Text>
              <Text style={styles.section0Text}>
                Payment: {order.paymentInfo.status}
              </Text>
            </View>
            <View style={styles.section0_1}>
              <Text style={styles.section0Text1}>
                Address: {order.deliveryInfo.address} {order.deliveryInfo.city}{" "}
                {order.deliveryInfo.pincode}
              </Text>
            </View>
          </View>
          <View style={styles.section1}>
            <>
              <View style={styles.section1Header}>
                <Text style={styles.item}>Item</Text>
                <Text style={styles.quantity}>Qty</Text>
                <Text style={styles.quantity}>Rate</Text>
                <Text style={styles.quantity}>Total</Text>
              </View>
              {order.orderItems?.map((item, index) => (
                <View key={index} style={styles.section1Content}>
                  <Text style={styles.item}>{item.name}</Text>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <Text style={styles.quantity}>{item.price}</Text>
                  <Text style={styles.quantity}>
                    {item.price * item.quantity}
                  </Text>
                </View>
              ))}
              <View style={styles.section1Content2}>
                <Text style={styles.item}></Text>
                <Text></Text>
                <Text style={styles.quantity1}>Subtotal</Text>
                <Text style={styles.quantity1}>{order.itemPrice}</Text>
              </View>
              <View style={styles.section1Content3}>
                <Text style={styles.item}></Text>
                <Text></Text>
                <Text style={styles.quantity1}>GST @5%</Text>
                <Text style={styles.quantity1}>{order.taxPrice}</Text>
              </View>
              <View style={styles.section1Content3}>
                <Text style={styles.item}></Text>
                <Text></Text>
                <Text style={styles.quantity1}>Discount</Text>
                <Text style={styles.quantity1}>{order.discount}</Text>
              </View>
              <View style={styles.section1Content3}>
                <Text style={styles.item}></Text>
                <Text></Text>
                <Text style={styles.quantity1}>Total Amount</Text>
                <Text style={styles.quantity1}>{order.totalPrice}</Text>
              </View>
            </>
          </View>
          <View style={styles.section2}>
            <Text>Thank you for ordering from us, enjoy your food</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};
export default OrderBill;
