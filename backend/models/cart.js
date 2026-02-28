import pool from "../pool.js"

export async function findCartByUserId(userId) {
    const result = await pool.query(`
        select id, user_id, created_at from carts where user_id = $1`,
    [userId]);
    return result.rows[0] || null;
}

export async function createCart(userId) {
    const result = await pool.query(`
        insert into carts (user_id) values ($1) returning id, user_id, created_at`,
    [userId]);
    return result.rows[0] || null;
}

export async function createCartIfNotExists(userId) {
    const existingCart = await findCartByUserId(userId);
    if (existingCart) return existingCart;
    return await createCart(userId);
}

export async function insertCartItem(userId, productId, quantity) {
    const cart = await createCartIfNotExists(userId);
    const result = await pool.query(`
        insert into cart_items (cart_id, product_id, quantity)
        values ($1, $2, $3)
        on conflict (cart_id, product_id)
        do update set quantity = cart_items.quantity + excluded.quantity
        returning *`,
        [cart.id, productId, quantity]);
    
    return result.rows[0] || null;
}