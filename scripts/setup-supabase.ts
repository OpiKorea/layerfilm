import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PAT = process.env.SUPABASE_ACCESS_TOKEN || "";

async function fetchProjects() {
    console.log("Attempting to fetch projects with provided PAT...");
    try {
        const response = await fetch('https://api.supabase.com/v1/projects', {
            headers: {
                'Authorization': `Bearer ${PAT}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error("Response:", text);
            return;
        }

        const projects = await response.json();
        console.log(`Found ${projects.length} projects.`);

        if (projects.length === 0) {
            console.error("No projects found on this account.");
            return;
        }

        const project = projects[0];
        console.log(`Selected Project: ${project.name} (${project.id})`);

        // Now fetch API keys for this project
        // Endpoint: /projects/{ref}/api-keys
        // Note: Management API might not expose Service Role key directly via this endpoint in all versions, 
        // but let's try or constructing URL is easy: https://<ref>.supabase.co

        const projectUrl = `https://${project.ref}.supabase.co`;
        console.log(`Project URL: ${projectUrl}`);

        // Note: The Management API /projects endpoint usually returns just metadata.
        // We might not be able to get the SERVICE_ROLE_KEY easily via API without the user copying it 
        // if the API doesn't expose it. 
        // However, let's check if the 'api_keys' are in the response or a sub-endpoint exists.
        // Documentation says GET /v1/projects/{ref}/api-keys is not a standard public endpoint?
        // Actually it is! GET /v1/projects/{ref}/api-keys

        const keysResponse = await fetch(`https://api.supabase.com/v1/projects/${project.id}/api-keys`, {
            headers: {
                'Authorization': `Bearer ${PAT}`,
                'Content-Type': 'application/json'
            }
        });

        // Wait, project.id in list might be the 'ref' or internal ID. 
        // Actually usually 'ref' is used (the subdomain part).
        // Let's try both if needed, but 'ref' is safer for URL construction.
        // For API calls, usually 'ref' is used in path.

        // Re-check response structure later, but assuming we can get keys.
        // Actually, often getting keys requires going to dashboard.
        // But if I can't get keys, I will at least have the URL.

        console.log("---------------------------------------------------");
        console.log("Project Ref:", project.id); // This is likely the 'ref' (e.g. qwerasdfzxcv)
        console.log("Project URL:", `https://${project.id}.supabase.co`);
        console.log("Region:", project.region);

        // Since we can't definitively get the SECRET keys via PAT strictly (security),
        // I might simply output what I found and ask the user to confirm the keys if I can't find them.
        // BUT often the PAT allows full control.

    } catch (error) {
        console.error("Error:", error);
    }
}

fetchProjects();
