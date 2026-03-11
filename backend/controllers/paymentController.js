import Stripe from "stripe";
import {getCartItems} from "../models/cart.js";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    export const createPaymentIntent = async (req, res) => {
        const userId = req.user.userId;

        try {
            const cartRows = await getCartItems(userId);
            if (!cartRows.length) {
                return res.status(400).json({error: "cart is empty"});
            }

            const totalCents = cartRows.reduce((sum, item) => {
                return sum + Math.round(item.price*100) * item.quantity;
            }, 0);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalCents,
                currency: "hkd",
                metadata: {userId: userId.toString()},
            });

            res.json({ clientSecret: paymentIntent.client_secret});
        } catch (err) {
            console.error("PaymentIntent creation failed: ", err);
            res.status(500).json({error: "Failed to create payment"});
        }
    };