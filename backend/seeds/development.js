import { insertUsers } from "./users.js";
import { ensureUserCarts, ensureCartItems } from "./cart.js";

export async function seedDevelopment(client) {
  console.log("Development seeding...");
  await insertUsers(client);
  await ensureUserCarts(client);
  await ensureCartItems(client);
}