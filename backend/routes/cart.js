import { Aircraft } from "@faker-js/faker";
import {authenticateToken} from "../middleware/auth.js"
import pool from "../pool.js"

const router = express.Router();

router.post("/items", authenticateToken, async(req, res) => {
    const  {productId, quantity} = req.body;
    const userId = req.user.userId;

    if (!productId) return res.status(400).json({error: "ProductId is required"});

    if (!Number.isInteger(quantity) || quantity <= 0) 
        return res.status(400).json({error: "Quantity must be positive integer"});

    try {
        // check 

    } catch (err) {

    }


})