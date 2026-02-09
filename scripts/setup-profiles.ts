import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PAT = process.env.SUPABASE_ACCESS_TOKEN || "";
const PROJECT_REF = process.env.SUPABASE_PROJECT_ID || "";

async function executeSql() {
    console.log("Reading profiles.sql...");
    const sqlPath = path.resolve(__dirname, '../supabase/profiles.sql');
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

        const status = response.status;
        const result = await response.text();
        console.log("Status:", status);
        console.log("Result:", result);

        if (status === 200 || status === 201) {
            console.log("✅ SQL Executed successfully!");
        } else {
            console.log("❌ SQL Execution failed.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

executeSql();
