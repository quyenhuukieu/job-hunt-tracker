const { Pool } = require("pg");

let pool;

module.exports = async function (context, req) {

    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
        context.res = { status: 400, body: { error: "Missing refresh token" }};
        return;
    }

    await pool.query(
        `
        UPDATE user_sessions
        SET is_revoked = TRUE
        WHERE refresh_token = $1
        `,
        [refreshToken]
    );

    context.res = {
        status: 200,
        body: { message: "Logged out successfully" }
    };
};