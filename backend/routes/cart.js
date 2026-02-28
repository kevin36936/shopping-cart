import { Aircraft } from "@faker-js/faker";
import {authenticateToken} from "../middleware/auth.js"
import {insertCartItem} from "../models/cart.js";

const router = express.Router();

router.post("/items", authenticateToken, async(req, res) => {
    const  {productId, quantity} = req.body;
    const userId = req.user.userId;

    if (!productId) return res.status(400).json({error: "ProductId is required"});

    if (!Number.isInteger(quantity) || quantity <= 0) 
        return res.status(400).json({error: "Quantity must be positive integer"});

    try {
        const cartItem = await insertCartItem(userId, productId, quantity);
        res.status(201).json(cartItem);
    } catch (err) {
        if (err.code === "23503") {
            return res.status(404).json({error: "Product not found"});
        }
        console.error("Add to cart error:", err);
        res.status(500).json({error: "internal server error"});
    }
});

export default router;