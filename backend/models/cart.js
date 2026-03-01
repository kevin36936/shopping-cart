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

export async function getCartItems(userId) {
    const cart = await findCartByUserId(userId);
    if(!cart) return [];
    const result = await pool.query(`
        select p.id as product_id, p.title, p.price, c.quantity, p.image from 
        cart_items c join products p on c.product_id = p.id
        where c.cart_id = $1`,
    [cart.id]);
    return result.rows;
}

export async function updateCartItemQuantity(userId, productId, newQuantity) {
    const cart = await findCartByUserId(userId);
    if(!cart) return null;

    const result = await pool.query(`
        update cart_items
        set quantity = $1
        where cart_id = $2 and product_id = $3
        returning *`
    , [newQuantity, cart.id, productId]);

    if (result.rowCount === 0) return null;
    return result.rows[0];

}

export async function deleteCartItem(userId, productId) {
    const cart = await findCartByUserId(userId);
    if(!cart) return null;

    const result = await pool.query(`
        delete from cart_items 
        where cart_id = $1 and product_id = $2
        returning product_id`,
    [cart.id, productId]);

    if(result.rowCount === 0) return null;
    return result.rows[0];
}