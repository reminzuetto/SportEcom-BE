const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {});
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;
