const { Pool } = require("pg");

let pool;

module.exports = async function (context, req) {

    context.log("POST /api/applications called");

    try {

        // Initialize pool once
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


        // Extract request body
        const {

            user_id,
            company_name,
            job_title,
            location,
            salary_range,
            job_url,
            applied_date,
            notes

        } = req.body || {};


        // Validate required fields
        if (!user_id || !company_name || !job_title) {

            context.res = {

                status: 400,

                body: {

                    success: false,

                    error: "Missing required fields: user_id, company_name, job_title"

                }

            };

            return;

        }


        // Default status = Applied (id = 2)
        const defaultStatusId = 2;


        // Begin transaction
        const client = await pool.connect();

        try {

            await client.query("BEGIN");


            // Insert application
            const insertApplicationQuery = `

                INSERT INTO applications (

                    user_id,
                    company_name,
                    job_title,
                    location,
                    salary_range,
                    job_url,
                    applied_date,
                    notes,
                    current_status_id

                )

                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)

                RETURNING *

            `;


            const applicationResult = await client.query(

                insertApplicationQuery,

                [

                    user_id,
                    company_name,
                    job_title,
                    location || null,
                    salary_range || null,
                    job_url || null,
                    applied_date || null,
                    notes || null,
                    defaultStatusId

                ]

            );


            const application = applicationResult.rows[0];


            // Insert status history
            const statusHistoryQuery = `

                INSERT INTO application_status_history (

                    application_id,
                    status_id,
                    changed_by

                )

                VALUES ($1,$2,$3)

            `;


            await client.query(

                statusHistoryQuery,

                [

                    application.id,
                    defaultStatusId,
                    user_id

                ]

            );


            await client.query("COMMIT");


            context.res = {

                status: 201,

                headers: {
                    "Content-Type": "application/json"
                },

                body: {

                    success: true,

                    message: "Application created successfully",

                    data: application

                }

            };


        } catch (error) {

            await client.query("ROLLBACK");

            throw error;

        } finally {

            client.release();

        }


    } catch (error) {

        context.log.error("Create application error:", error);


        context.res = {

            status: 500,

            headers: {
                "Content-Type": "application/json"
            },

            body: {

                success: false,

                error: "Internal server error"

            }

        };

    }

};