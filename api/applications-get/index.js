const { Pool } = require("pg");

const authenticate = require("../_shared/auth");

let pool;

module.exports = async function (context, req) {

    context.log("Applications GET called");


    // Authenticate user
    const user = authenticate(context, req);


    if (!user) {

        return;

    }


    try {

        if (!pool) {

            pool = new Pool({

                connectionString: process.env.DATABASE_URL,

                ssl: { rejectUnauthorized: false }

            });

        }


        const result = await pool.query(

            `
            SELECT *
            FROM applications
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,

            [user.userId]

        );


        context.res = {

            status: 200,

            body: {

                success: true,

                data: result.rows

            }

        };


    } catch (error) {

        context.res = {

            status: 500,

            body: error.message

        };

    }

};