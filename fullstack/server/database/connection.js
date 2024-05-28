const mongoose = require("mongoose");
const dotenv = require("dotenv");
mongoose.set("strictQuery", true);

dotenv.config();

const url = process.env.MONGO_URI + "";

const connectDB = () => {
  try {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
