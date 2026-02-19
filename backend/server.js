import express from "express"
import cors from "cors"

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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});