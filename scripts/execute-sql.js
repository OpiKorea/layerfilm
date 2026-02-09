
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PAT = process.env.SUPABASE_ACCESS_TOKEN || "";
const PROJECT_REF = process.env.SUPABASE_PROJECT_ID || "";

async function executeSql() {
    console.log("Reading SQL file...");
    const sqlPath = path.resolve(__dirname, '../scripts/set-admin.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    console.log(`Executing SQL on project ${PROJECT_REF}...`);

    try {
        const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        });

        if (!response.ok) {
            console.error(`Failed to execute SQL: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }

        const result = await response.text();
        console.log("SQL Execution Result:", result);
        console.log("✅ Admin privileges granted successfully!");

    } catch (error) {
        console.error("Error executing SQL:", error);
    }
}

executeSql();
