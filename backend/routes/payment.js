import express from "express";
import  {authenticateToken} from "../middleware/auth.js";
import  {createPaymentIntent} from "../controllers/paymentController.js"

const router = express.Router();
router.post("/create-payment-intent", authenticateToken, createPaymentIntent);

export default router;