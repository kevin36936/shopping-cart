import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cartRoutes from "./routes/cart.js";
import productRoute from "./routes/products.js";
import healthRoute from "./routes/health.js";
import paymentRoute from "./routes/payment.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoute);
app.use("/api", cartRoutes);
app.use("/api", paymentRoute);
app.use("/health", healthRoute);

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
