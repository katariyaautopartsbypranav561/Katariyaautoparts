require('dotenv').config();
const { createClient } = require('@libsql/client');

async function checkSchema() {
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const result = await libsql.execute('PRAGMA table_info("Order")');
  console.log("Order table columns:");
  result.rows.forEach(row => console.log(" -", row.name, row.type));
}

checkSchema().catch(console.error);
