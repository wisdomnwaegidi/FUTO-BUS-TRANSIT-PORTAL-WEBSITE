const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    profilePicture: {
      type: String,
      default: "/uploads/userimage.png",
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const Userdb = mongoose.model("Userdb", formSchema);
module.exports = Userdb;
