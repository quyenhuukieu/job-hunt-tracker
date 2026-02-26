const { Pool } = require("pg");
const jwt = require("jsonwebtoken");

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

    try {

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const session = await pool.query(
            `
            SELECT * FROM user_sessions
            WHERE refresh_token = $1
            AND is_revoked = FALSE
            AND expires_at > NOW()
            `,
            [refreshToken]
        );

        if (session.rows.length === 0) {
            context.res = { status: 401, body: { error: "Invalid session" }};
            return;
        }

        // ROTATE refresh token
        const newRefreshToken = jwt.sign(
            { userId: decoded.userId, type: "refresh" },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "30d" }
        );

        await pool.query(
            `
            UPDATE user_sessions
            SET refresh_token = $1,
                expires_at = NOW() + INTERVAL '30 days'
            WHERE refresh_token = $2
            `,
            [newRefreshToken, refreshToken]
        );

        const newAccessToken = jwt.sign(
            { userId: decoded.userId, type: "access" },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        context.res = {
            status: 200,
            body: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        };

    } catch {
        context.res = { status: 401, body: { error: "Invalid refresh token" }};
    }
};