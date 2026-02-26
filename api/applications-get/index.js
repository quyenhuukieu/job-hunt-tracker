const { Pool } = require("pg");

// Reuse pool across executions (IMPORTANT for performance)
let pool;

module.exports = async function (context, req) {

    context.log("GET /api/applications called");

    try {

        // Create pool only once
        if (!pool) {

            pool = new Pool({

                connectionString: process.env.DATABASE_URL,

                ssl: {
                    rejectUnauthorized: false
                },

                max: 5, // connection limit
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000

            });

        }


        // Optional query params
        const userId = req.query.user_id;


        // Base query
        let query = `

            SELECT

                a.id,
                a.company_name,
                a.job_title,
                a.location,
                a.salary_range,
                a.applied_date,
                a.created_at,
                a.updated_at,

                s.id as status_id,
                s.name as status

            FROM applications a

            LEFT JOIN application_status s
            ON a.current_status_id = s.id

        `;


        let values = [];


        // Filter by user if provided
        if (userId) {

            query += ` WHERE a.user_id = $1 `;
            values.push(userId);

        }


        query += `
            ORDER BY a.created_at DESC
        `;


        const result = await pool.query(query, values);


        context.res = {

            status: 200,

            headers: {
                "Content-Type": "application/json"
            },

            body: {

                success: true,

                count: result.rows.length,

                data: result.rows

            }

        };


    } catch (error) {

        context.log.error("Database error:", error);


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