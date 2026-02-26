const { Pool } = require("pg");

const authenticate = require("../_shared/auth");

let pool;

module.exports = async function (context, req) {

    context.log("POST /api/applications called");


    // STEP 1 — Authenticate user
    const user = authenticate(context, req);

    if (!user) {

        return;

    }


    try {

        // STEP 2 — Create pool if not exists
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


        // STEP 3 — Extract request body
        const {

            company_name,
            job_title,
            location,
            salary_range,
            job_url,
            notes

        } = req.body;


        // STEP 4 — Validate required fields
        if (!company_name || !job_title) {

            context.res = {

                status: 400,

                body: {

                    success: false,
                    error: "company_name and job_title are required"

                }

            };

            return;

        }


        // STEP 5 — Insert securely using JWT userId
        const result = await pool.query(

            `
            INSERT INTO applications
            (
                user_id,
                company_name,
                job_title,
                location,
                salary_range,
                job_url,
                notes,
                current_status_id
            )

            VALUES
            ($1,$2,$3,$4,$5,$6,$7,1)

            RETURNING *
            `,

            [

                user.userId, // SECURE — from JWT
                company_name,
                job_title,
                location || null,
                salary_range || null,
                job_url || null,
                notes || null

            ]

        );


        // STEP 6 — Return success
        context.res = {

            status: 201,

            body: {

                success: true,

                message: "Application created",

                data: result.rows[0]

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