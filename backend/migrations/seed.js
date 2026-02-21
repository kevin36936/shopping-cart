import fetch from "node-fetch";
import pg from "pg";
import "dotenv/config"

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

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

/*
Ensures the products table exists and ensure the script idempotent
*/
async function ensureTable(client) {
    await client.query(`
        create table if not exists products(
            id int primary key,
            title text not null,
            price numeric(10, 2) not null,
            image text default 'no-image.png'
        );
    `);
    console.log("Table 'products' is ready.")
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
        await ensureTable(client);

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