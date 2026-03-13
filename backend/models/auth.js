import pool from "../pool.js"

export async function findUserByEmail(email, client = pool) {
    const result = await client.query(
        "select id from users where email = $1",
        [email]
    )
    return result.rows[0] || null;
}

export async function findUserForLogin(email, client = pool) {
    const result = await client.query(
        "select id, email, password_hash from users where email = $1",
        [email]
    );
    return result.rows[0] || null;
}

export async function createUser(email, hashedPassword, client = pool) {
    const result = await client.query(
        `insert into users (email, password_hash) 
        values ($1, $2)
        returning id, email, created_at`,
        [email, hashedPassword]
    );
    return result.rows[0];
}
