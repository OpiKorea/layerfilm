import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PAT = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = process.env.SUPABASE_PROJECT_ID;

if (!PAT || !PROJECT_REF) {
    console.error("❌ Missing SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_ID in .env.local");
    process.exit(1);
}

async function run() {
    console.log("Applying AI Cinema Schema Migration...");

    try {
        const sqlPath = path.join(__dirname, '../supabase/migrations/20260208_ai_cinema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ SQL Execution Failed: ${res.status} ${res.statusText}`);
            console.error(errorText);
            return;
        }

        const data = await res.json();
        console.log("✅ Migration applied successfully!");
        if (data.error) {
            console.error("SQL Error:", data.error);
        }

    } catch (e) {
        console.error("❌ Script Error:", e);
    }
}

run();
