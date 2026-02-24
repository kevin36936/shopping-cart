import fetch from "node-fetch"

export async function fetchProducts() {
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
export async function insertProducts(client, products) {
    let inserted = 0;

    await client.query("begin");

    try {
        for (const product of products) {
            if (!product.id || !product.title || product.price == null) {
                console.warn(`Skipping invalid produuct: ${product}`)
                continue;
            }

            const res = await client.query(
                `insert into products (id, title, price, image)
                values ($1, $2, $3, $4)
                on conflict do nothing`,
                [
                    product.id,
                    product.title,
                    product.price,
                    product.image,
                ]
            );
            if(res.rowCount>0) inserted++;
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
