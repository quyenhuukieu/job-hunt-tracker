const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let pool;

module.exports = async function (context, req) {

    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }

    const { email, password } = req.body;

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email.toLowerCase()]
    );

    const user = result.rows[0];

    if (!user) {
        context.res = { status: 401, body: { error: "Invalid credentials" }};
        return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
        context.res = { status: 401, body: { error: "Invalid credentials" }};
        return;
    }

    // ACCESS TOKEN (15 min)
    const accessToken = jwt.sign(
        { userId: user.id, type: "access" },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    // REFRESH TOKEN (30 days)
    const refreshToken = jwt.sign(
        { userId: user.id, type: "refresh" },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    );

    // Store refresh token in DB
    await pool.query(
        `
        INSERT INTO user_sessions
        (user_id, refresh_token, user_agent, ip_address, expires_at)
        VALUES ($1,$2,$3,$4, NOW() + INTERVAL '30 days')
        `,
        [
            user.id,
            refreshToken,
            req.headers["user-agent"] || null,
            req.headers["x-forwarded-for"] || null
        ]
    );

    context.res = {
        status: 200,
        body: {
            accessToken,
            refreshToken
        }
    };
};