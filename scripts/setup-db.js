/* eslint-disable */
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const PAT = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = process.env.SUPABASE_PROJECT_ID;

async function run() {
    console.log("Starting SQL setup...");
    const sql = fs.readFileSync(path.join(__dirname, '../supabase/profiles.sql'), 'utf8');

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
        console.log("Status:", res.status);
        console.log("Response:", data);

        if (res.ok) {
            console.log("✅ SQL successfully executed via Management API.");
        } else {
            console.log("❌ Failed to execute SQL.");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
