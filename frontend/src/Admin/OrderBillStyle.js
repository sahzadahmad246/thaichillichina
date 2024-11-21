// OrderBillStyles.js
import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    width: "58mm",
    padding: 2,
    backgroundColor: "#0000",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    fontSize: 2,
  },

  header: {
    fontSize: 16,
    marginBottom: 2,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    padding: "1px",
  },
  outletLogo: {
    width: 5,
    height: 5,
    objectFit: "cover",
    margin: 1,
  },
  headerBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 2,
    marginBottom: "1px",
  },
  section0: {
    padding: "1px",
    marginBottom: 2,
  },
  section0_1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "0.2px",
  },
  section0Text: {
    width: "50%",
    padding: "1px",
  },
  section0Text1: {
    width: "100%",
    padding: "1px",
  },
  section1: {
    padding: "1px",
  },
  section1Header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "2px",
    borderBottom: "0.1px solid #ddd",
  },
  section1Content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "1px",
  },
  section1Content2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "1px",
    marginTop: "4px",
    borderTop: "0.1px solid #ddd",
  },
  section1Content3: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "1px",
  },
  item: {
    width: "60%",
    fontSize: 2,
  },
  quantity: {
    textAlign: "center",
    width: "13%",
  },
  quantity1: {
    textAlign: "right",
    width: "18%",
  },
  section2: {
    textAlign: "center",
    marginTop: "7px",
    marginBottom: "3px",
  },
});

export default styles;
