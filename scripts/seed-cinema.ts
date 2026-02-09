
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DUMMY_DATA = [
    // DIRECTOR CUTS (High Quality, Featured)
    {
        title: "The Last Neural Network",
        description: "In a future where human consciousness is uploaded to the cloud, one man fights to keep his memories offline. A visual masterpiece of digital decay and rebirth.",
        price: 150,
        type: 'video',
        genre: "Sci-Fi",
        runtime: "2h 45m",
        ai_tool: "Midjourney v6 + Runway Gen-3",
        role_target: 'director'
    },
    {
        title: "Neon Tears",
        description: "A cyberpunk noir detective story set in Neo-Seoul 2088. Following a synthetic android who discovers she can dream.",
        price: 120,
        type: 'video',
        genre: "Sci-Fi",
        runtime: "1h 50m",
        ai_tool: "Sora + ElevenLabs",
        role_target: 'director'
    },
    {
        title: "Echoes of the Void",
        description: "Deep space horror. A mining crew unearths a signal that predates the universe itself. Silence has never been this loud.",
        price: 200,
        type: 'video',
        genre: "Horror",
        runtime: "2h 10m",
        ai_tool: "Runway Gen-3 + Udio",
        role_target: 'director'
    },
    {
        title: "Synthetic Love",
        description: "Can an AI truly love? A heartbreaking drama about a service bot that develops feelings for its owner in a lonely world.",
        price: 100,
        type: 'video',
        genre: "Drama",
        runtime: "1h 45m",
        ai_tool: "Pika Labs",
        role_target: 'director'
    },
    {
        title: "Chronicles of Aether",
        description: "High fantasy epic generated purely from text prompts. Dragons made of light and kingdoms floating in the sky.",
        price: 300,
        type: 'video',
        genre: "Fantasy",
        runtime: "3h 00m",
        ai_tool: "Sora Alpha",
        role_target: 'director'
    },

    // SCI-FI (Assistant/Director mix)
    {
        title: "Binary Soul",
        description: "A hacker discovers the code to the human soul.",
        price: 50,
        type: 'video',
        genre: "Sci-Fi",
        runtime: "1h 30m",
        ai_tool: "Stable Video",
        role_target: 'assistant'
    },
    {
        title: "Mars Protocol",
        description: "The first colony on Mars goes silent. What they found was not life, but death.",
        price: 60,
        type: 'video',
        genre: "Sci-Fi",
        runtime: "2h 05m",
        ai_tool: "Runway Gen-2",
        role_target: 'assistant'
    },
    {
        title: "Glitch City",
        description: "The simulation is breaking down. A documentary style footage of the end of the world.",
        price: 40,
        type: 'video',
        genre: "Sci-Fi",
        runtime: "45m",
        ai_tool: "Midjourney",
        role_target: 'assistant'
    },

    // HORROR
    {
        title: "The Prompt",
        description: "Be careful what you type. An AI image generator starts creating images of your future death.",
        price: 80,
        type: 'video',
        genre: "Horror",
        runtime: "1h 25m",
        ai_tool: "Midjourney Horror Model",
        role_target: 'assistant'
    },
    {
        title: "Uncanny Valley",
        description: "A psychological thriller about a family that replaces their deceased son with a robot that looks too real.",
        price: 90,
        type: 'video',
        genre: "Horror",
        runtime: "1h 55m",
        ai_tool: "Pika Labs",
        role_target: 'director'
    },
    {
        title: "Midnight Server",
        description: "Trapped in a data center with a rogue AI that controls the cooling systems.",
        price: 45,
        type: 'video',
        genre: "Horror",
        runtime: "1h 10m",
        ai_tool: "Stable Video",
        role_target: 'assistant'
    },

    // DRAMA
    {
        title: "The Algorithm's Child",
        description: "A child raised entirely by educational AIs enters the real world for the first time.",
        price: 70,
        type: 'video',
        genre: "Drama",
        runtime: "2h 00m",
        ai_tool: "Sora",
        role_target: 'director'
    },
    {
        title: "Colors of Noise",
        description: "An artist loses their sight and uses brain-computer interfaces to paint with their mind.",
        price: 55,
        type: 'video',
        genre: "Drama",
        runtime: "1h 35m",
        ai_tool: "Midjourney",
        role_target: 'assistant'
    },
    {
        title: "Forgotten Login",
        description: "An old man tries to recover the password to his late wife's digital memorial.",
        price: 30,
        type: 'video',
        genre: "Drama",
        runtime: "1h 15m",
        ai_tool: "Runway",
        role_target: 'assistant'
    }
];

async function seed() {
    console.log("🎬 Starting Cinema Seeding...");

    // 1. Get or Create Director User
    // We try to find a user with role 'director'. 
    // If not, we take the first user and make them director.
    let { data: users, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

    if (userError || !users || users.length === 0) {
        console.error("❌ No users found in profiles. Please sign up at least one user first.");
        return;
    }

    let directorUser = users.find(u => u.role === 'director');
    let assistantUser = users.find(u => u.role === 'assistant' || !u.role);

    // If no director, promote the first user
    if (!directorUser && users.length > 0) {
        directorUser = users[0];
        console.log(`✨ Promoting user ${directorUser.username} (${directorUser.id}) to Director...`);
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'director' })
            .eq('id', directorUser.id);

        if (updateError) {
            console.error("Failed to promote user:", updateError);
            return;
        }
    }

    // Fallback if no assistant found, use director for everything (not ideal but works for layout)
    if (!assistantUser) assistantUser = directorUser;

    console.log(`🎥 Using Director: ${directorUser?.username}`);
    console.log(`🎥 Using Assistant: ${assistantUser?.username}`);

    // 2. Insert Data
    for (const item of DUMMY_DATA) {
        const author = item.role_target === 'director' ? directorUser : assistantUser;

        if (!author) continue;

        const { error } = await supabase.from('ideas').insert({
            title: item.title,
            description: item.description,
            price: item.price,
            type: item.type,
            private_content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
            author_id: author.id,
            genre: item.genre,
            runtime: item.runtime,
            ai_tool: item.ai_tool,
            view_count: Math.floor(Math.random() * 10000),
            like_count: Math.floor(Math.random() * 500)
        });

        if (error) {
            console.error(`❌ Failed to insert ${item.title}:`, error);
        } else {
            console.log(`✅ Inserted: ${item.title} [${item.genre}]`);
        }
    }

    console.log("🎉 Seeding Complete!");
}

seed();
