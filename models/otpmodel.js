const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "number required"],
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt:{ type: Date,default:Date.now(),index:{expires:300}},
  },
  { timestamps: true,}
);


const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;