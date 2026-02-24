import {faker} from "@faker-js/faker"
import bcrpyt from "bcryptjs"

faker.seed(123);

async function hashPassword(plainPassword) {
    const saltRounds = 10;
    return await bcrpyt.hash(plainPassword, saltRounds);
}

function generateFakeUsers(count = 5) {
    const users = [];
    for (let i=0; i<count; i++){
        users.push({
            email: faker.internet.email(),
            plainPassword: "password123", // same password for all fake users
        });
    }
    return users;
}

export async function insertUsers(client) {
        const users = generateFakeUsers(5);
        let inserted = 0;

        await client.query("Begin");
        try {
            for (const user of users) {
                const passwordHash = await hashPassword(user.plainPassword);
                const res = await client.query(
                    `insert into users (email, password_hash)
                    values ($1, $2)
                    on conflict (email) do nothing`,
                    [user.email, passwordHash]
                );
                if(res.rowCount>0) inserted++;
            }
            await client.query("commit");
            console.log(`Inserted ${inserted} new users`);
        } catch (err) {
            await client.query("rollback");
            console.error("User insertion failed, rolled back");
            throw err;
        }
}