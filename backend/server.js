import express from "express"
import cors from "cors"
import "dotenv/config"
import pool from "./db.js"

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
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok){
            return res.status(response.status).json({
                error: `Failed to fetch products: ${response.statusText}`
            })
        }

        const data = await response.json()
        res.status(200).json(data);
    }
    catch(error){
        console.log("Error fetching prodcts:", error)
        res.status(500).json({error: "Internal Server Error"})
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