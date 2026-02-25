export async function ensureUserCarts(client) {
    await client.query("begin");

    try {
        // Insert Cart to database
        const res = await client.query(
            `insert into carts (user_id)
            select id from users
            where not exists (
                select 1 from carts
                where carts.user_id = users.id
            );
            `
        );

        await client.query("commit");
        console.log(`Inserted ${res.rowCount} carts`)
    } catch (err) {
        await client.query("rollback");
        console.error("Transaction failed, rolled back");
        throw err;
    }
}

export async function ensureCartItems(client) {
    await client.query("begin");
     try {
        const res = await client.query(
            `insert into cart_items (cart_id, product_id, quantity)
            select c.id, 1, 1 
            from carts c
            where not exists (
                select 1 from cart_items ci
                where ci.cart_id = c.id
            );`
        );
         
        await client.query("commit");
        console.log(`Inserted ${res.rowCount} cartItems`);
     } catch (err) {
        await client.query("rollback");
        console.error("Transaction failed, rolled back")
        throw err;
     }
}

