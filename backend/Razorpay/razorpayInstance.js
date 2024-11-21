const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

module.exports = razorpayInstance;
