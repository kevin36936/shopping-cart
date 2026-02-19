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

app.get("/api/product", async (req, res) => {
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


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});