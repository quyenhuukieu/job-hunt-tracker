const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let pool;


/**
 * Password requirements:
 * Minimum 8 characters
 * At least 1 uppercase
 * At least 1 lowercase
 * At least 1 number
 * At least 1 special character
 */
function validatePassword(password) {

    const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    return strongPasswordRegex.test(password);

}



module.exports = async function (context, req) {

    context.log("POST /api/auth/register called");

    try {

        if (!pool) {

            pool = new Pool({

                connectionString: process.env.DATABASE_URL,

                ssl: {
                    rejectUnauthorized: false
                },

                max: 5,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000

            });

        }


        const {

            email,
            password,
            first_name,
            last_name

        } = req.body || {};


        // Validate required fields
        if (!email || !password) {

            context.res = {

                status: 400,

                body: {
                    success: false,
                    error: "Email and password required"
                }

            };

            return;

        }


        // Validate password strength
        if (!validatePassword(password)) {

            context.res = {

                status: 400,

                body: {

                    success: false,

                    error:
                        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"

                }

            };

            return;

        }


        // Check if user exists
        const existingUser = await pool.query(

            `SELECT id FROM users WHERE email = $1`,

            [email.toLowerCase()]

        );


        if (existingUser.rows.length > 0) {

            context.res = {

                status: 409,

                body: {

                    success: false,

                    error: "Email already registered"

                }

            };

            return;

        }


        // Hash password
        const saltRounds = 12;

        const password_hash = await bcrypt.hash(

            password,
            saltRounds

        );


        // Insert user
        const result = await pool.query(

            `
            INSERT INTO users
            (
                email,
                password_hash,
                first_name,
                last_name
            )

            VALUES ($1,$2,$3,$4)

            RETURNING id, email, first_name, last_name
            `,

            [

                email.toLowerCase(),
                password_hash,
                first_name || null,
                last_name || null

            ]

        );


        const user = result.rows[0];


        // Generate JWT token (AUTO LOGIN)
        const token = jwt.sign(

            {

                userId: user.id,
                email: user.email

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );


        // Return success
        context.res = {

            status: 201,

            body: {

                success: true,

                message: "User registered successfully",

                token,

                user

            }

        };


    } catch (error) {

        context.log.error(error);


        context.res = {

            status: 500,

            body: {

                success: false,

                error: "Internal server error"

            }

        };

    }

};