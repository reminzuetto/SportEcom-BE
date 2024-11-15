// Import các thư viện cần thiết
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Product = require("./models/Product");
const authRoute = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Định nghĩa các route
app.use("/api/auth", authRoute);

// API lấy tất cả sản phẩm
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}); // Tìm tất cả sản phẩm trong MongoDB
    res.json(products); // Trả về danh sách sản phẩm
  } catch (err) {
    console.error("Error fetching products", err); // Log lỗi ra console
    res.status(500).json({ message: "Server error" }); // Trả về thông báo lỗi
  }
});
