import "dotenv/config"
import pool from "../pool.js"
import { fetchProducts, insertProducts } from "./product.js";
import {insertUsers} from "./users.js"
import {ensureUserCarts, ensureCartItems} from "./cart.js"

async function seed() {
    const client = await pool.connect();

    try {
        
        console.log("Connected to database")

        // Seed Products (idempotent)
        console.log("Seeding products...");
        console.log("Fetching products from API...");
        const products = await fetchProducts();
        console.log(`Feteched ${products.length} products`);
        await insertProducts(client, products);

        // Seed Users (idempotent)
        console.log("Seeding users...");
        await insertUsers(client);

        // Seed Carts (idempotent)
        console.log("Seeing carts...")
        await ensureUserCarts(client);

        // Seed CartItem (idempotent)
        console.log("Seeding cartItems...");
        await ensureCartItems(client);

        console.log("seeding completed successfully.");
    } catch (err) {
        console.error("Seeding failed", err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

seed().catch(err => {
    console.error("Fetal error", err);
    process.exit(1)
})