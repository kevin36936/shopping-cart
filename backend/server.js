import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cartRoutes from "./routes/cart.js";
import productRoutes from "./routes/products.js";
import healthRoutes from "./routes/health.js";
import paymentRoutes from "./routes/payment.js";
import orderRoutes from "./routes/orders.js"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes)
app.use("/health", healthRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Shopping Cart API is running" });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from backend!",
    timestamp: new Date().toISOString(),
    status: "success",
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
