require('dotenv').config();
const { createClient } = require('@libsql/client');

async function main() {
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    await libsql.execute(`ALTER TABLE "Order" ADD COLUMN customerEmail TEXT;`);
    console.log("Column added successfully!");
  } catch (error) {
    if (error.message.includes('duplicate column')) {
      console.log("Column already exists.");
    } else {
      console.error("Error altering table:", error);
    }
  }
}
main();
