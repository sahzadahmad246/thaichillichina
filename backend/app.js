const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middleware/error");
const { authorizeRoles, isAuthenticatedUser } = require("./middleware/auth");

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// CORS setup (optional, you can adjust based on your environment)
const corsOptions = {
  origin: [ "http://localhost:5000"],
  methods: "GET, POST, PUT, DELETE, HEAD, FETCH",
  credentials: true,
};
app.use(cors(corsOptions));

// API routes
app.get("/api/v1/getkey", (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// Importing routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const adminRoutes = require("./routes/adminRoute");
const coupon = require("./routes/couponRoute");

// API route usage
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", coupon);

// Serve React app (static files) in production
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

// Attach the io instance for real-time features (if needed)
app.use((req, res, next) => {
  req.io = io; // Attach io instance to req
  next();
});

// Middleware to handle errors
app.use(errorMiddleware);
app.use(isAuthenticatedUser);
app.use(authorizeRoles);

module.exports = app; // Export the app for deployment
