import express from "express"
import cors from "cors"
import "dotenv/config"
import pool from "./pool.js"

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.json({message: "Shopping Cart API is running"});
})


app.get("/api/test", (req, res) => {
    res.json({
        message: "Hello from backend!",
        timestamp: new Date().toISOString(),
        status: "success"
    });
});

app.get("/api/products", async (req, res) => {
    try {
        const result = await pool.query("select * from products");
        const products = result.rows.map(product => ({
            ...product,
            price: parseFloat(product.price)
        }));
        res.json(products);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Database error"});
    }
});

app.get("/api/db-test", async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT NOW()");
        client.release();

        res.json({
            success: true,
            message: "Database connected successfully!",
            server_time: result.rows[0].now
        });
    } catch(error) {
        console.error("DB connection error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});