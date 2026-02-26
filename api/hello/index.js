const { Pool } = require("pg");

module.exports = async function (context, req) {

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const result = await pool.query("SELECT NOW()");

  context.res = {
    body: result.rows[0]
  };

};