
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const PAT = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = process.env.SUPABASE_PROJECT_ID;

async function run() {
    const migrationFile = '20260209_social_features.sql';
    const sqlPath = path.resolve(__dirname, `../supabase/migrations/${migrationFile}`);

    if (!fs.existsSync(sqlPath)) {
        console.error(`Migration file not found: ${sqlPath}`);
        process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log(`🚀 Applying migration: ${migrationFile}...`);

    try {
        const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: sql })
        });

        const data = await res.json();
        if (res.ok) {
            console.log("✅ SQL migration successful.");
        } else {
            console.error("❌ Failed to execute migration:", data);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
