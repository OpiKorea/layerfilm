import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PAT = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = process.env.SUPABASE_PROJECT_ID;

if (!PAT || !PROJECT_REF) {
    console.error("Error: SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_ID is missing in .env.local");
    process.exit(1);
}

async function runMigration() {
    console.log("Applying migration: Unique Username Constraint...");

    const sqlPath = path.join(__dirname, '../supabase/migrations/20240208_unique_username.sql');
    if (!fs.existsSync(sqlPath)) {
        console.error("Error: Migration file not found at", sqlPath);
        process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    try {
        const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`Failed to execute SQL: ${res.status} ${res.statusText}`);
            console.error("Response:", text);
            return;
        }

        const data = await res.json();
        console.log("✅ Migration successful!");
        console.log("Response:", JSON.stringify(data, null, 2));

    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error("Error executing migration:", e.message);
        } else {
            console.error("Error executing migration:", e);
        }
    }
}

runMigration();
