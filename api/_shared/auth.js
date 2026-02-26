const jwt = require("jsonwebtoken");

module.exports = function authenticate(context, req) {

    try {

        const header = req.headers.authorization;

        if (!header) {
            context.res = { status: 401, body: { error: "Missing token" }};
            return null;
        }

        const token = header.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        return decoded;

    } catch {
        context.res = { status: 401, body: { error: "Invalid or expired token" }};
        return null;
    }
};