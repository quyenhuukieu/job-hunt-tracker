const pool = require("./db");

module.exports = async function (context, req) {

  const result = await pool.query("SELECT NOW()");

  context.res = {
    body: result.rows[0]
  };

};