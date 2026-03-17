import bcrypt from "bcryptjs";

async function hashPassword(plainPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

export async function insertUsers(client) {
    // Dynamically import faker only when this function is called
    const { faker } = await import('@faker-js/faker');
    faker.seed(123);

    function generateFakeUsers(count = 5) {
        const users = [];
        for (let i = 0; i < count; i++) {
            users.push({
                email: faker.internet.email(),
                plainPassword: "password123",
            });
        }
        return users;
    }

    const users = generateFakeUsers(5);
    let inserted = 0;

    await client.query("BEGIN");
    try {
        for (const user of users) {
            const passwordHash = await hashPassword(user.plainPassword);
            const res = await client.query(
                `INSERT INTO users (email, password_hash)
                 VALUES ($1, $2)
                 ON CONFLICT (email) DO NOTHING`,
                [user.email, passwordHash]
            );
            if (res.rowCount > 0) inserted++;
        }
        await client.query("COMMIT");
        console.log(`Inserted ${inserted} new users`);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("User insertion failed, rolled back");
        throw err;
    }
}