import pool from "../pool.js"

export async function findUserByEmail(email) {
    const result = await pool.query(
        "select id from users where email = $1",
        [email]
    )
    return result.rows[0] || null;
}

export async function createUser(email, hashedPassword) {
    const result = await pool.query(
        `insert into users (email, password_hash) 
        values ($1, $2)
        returning id, email, created_at`,
        [email, hashedPassword]
    );
    return result.rows[0];
}
