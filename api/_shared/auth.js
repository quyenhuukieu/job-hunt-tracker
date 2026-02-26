const jwt = require("jsonwebtoken");

module.exports = function authenticate(context, req) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            context.res = {

                status: 401,

                body: {
                    success: false,
                    error: "Missing Authorization header"
                }

            };

            return null;
        }


        const token = authHeader.split(" ")[1];


        if (!token) {

            context.res = {

                status: 401,

                body: {
                    success: false,
                    error: "Missing token"
                }

            };

            return null;
        }


        const decoded = jwt.verify(

            token,
            process.env.JWT_SECRET

        );


        return decoded;


    } catch (error) {

        context.res = {

            status: 401,

            body: {
                success: false,
                error: "Invalid or expired token"
            }

        };

        return null;

    }

};