import fetch from "node-fetch"
import "dotenv/config"
import pool from "../pool.js"

async function fetchProducts() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const res = await fetch('https://fakestoreapi.com/products', {
            signal: controller.signal
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json();
    } finally {
        clearTimeout(timeout);
    }
}

// inserts products into the database inside a transaction.
async function insertProducts(client, products) {
    let inserted = 0;

    await client.query("begin");

    try {
        for (const product of products) {
            if (!product.id || !product.title || product.price == null) {
                console.warn(`Skipping invalud produuct: ${product}`)
                continue;
            }

            await client.query(
                `insert into products (id, title, price, image)
                values ($1, $2, $3, $4)`,
                [
                    product.id,
                    product.title,
                    product.price,
                    product.image,
                ]
            );
            inserted++
        }

        await client.query("commit");
        console.log(`Inserted ${inserted} products`);
    } catch (err) {
        await client.query("rollback");
        console.error("Transaction failed, rolled back.");
        throw err;
    }

    return inserted;
}

async function seed() {
    const client = await pool.connect();

    try {
        console.log("Connected to database")
        console.log("Fetching products from API...");
        const products = await fetchProducts();
        console.log(`Fteched ${products.length} products`);

        await insertProducts(client, products);

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