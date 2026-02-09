import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const COMING_SOON_MOVIES = [
    {
        title: "Neon Genesis: The Awakening",
        description: "In 2099, the first AI achieves consciousness not through code, but through dreaming.",
        genre: "Sci-Fi",
        tags: ["Cyberpunk", "AI", "Dystopia"],
        status: "coming_soon"
    },
    {
        title: "Silence of the Void",
        description: "A deep space mining crew discovers something that makes sound in a vacuum.",
        genre: "Horror",
        tags: ["Space", "Thriller", "Cosmic Horror"],
        status: "coming_soon"
    },
    {
        title: "The LAST Barista",
        description: "In a world of automated synth-cafes, one human still brews coffee by hand.",
        genre: "Drama",
        tags: ["Humanity", "Slice of Life", "Future"],
        status: "coming_soon"
    },
    {
        title: "Glitch in the Memory",
        description: "A detective realizes his childhood memories belong to someone else.",
        genre: "Mystery",
        tags: ["Noir", "Mind-bending", "Investigation"],
        status: "coming_soon"
    },
    {
        title: "Cyber-Samurai 2077",
        description: "A ronin mercenary protects a digital geisha from corporate yakuzas.",
        genre: "Action",
        tags: ["Cyberpunk", "Action", "Martial Arts"],
        status: "coming_soon"
    },
    {
        title: "Velvet Protocol",
        description: "A spy thriller where the agents can change their faces at will.",
        genre: "Thriller",
        tags: ["Spy", "Espionage", "Action"],
        status: "coming_soon"
    },
    {
        title: "Echoes of Earth",
        description: "Post-apocalyptic survivors find a recording of the old world.",
        genre: "Drama",
        tags: ["Post-Apocalyptic", "Nature", "Emotional"],
        status: "coming_soon"
    },
    {
        title: "Quantum Love",
        description: "Two lovers separated by parallel dimensions try to find a frequency to connect.",
        genre: "Romance",
        tags: ["Sci-Fi", "Romance", "Multiverse"],
        status: "coming_soon"
    },
    {
        title: "The Algorithm's Nightmare",
        description: "What happens when the central AI has a panic attack?",
        genre: "Experimental",
        tags: ["Abstract", "Horror", "Surreal"],
        status: "coming_soon"
    },
    {
        title: "Martian Chronicles: Year One",
        description: "The first year of the Mars colony was not what they promised.",
        genre: "Sci-Fi",
        tags: ["Mars", "Survival", "Drama"],
        status: "coming_soon"
    }
];

async function seed() {
    console.log("🌱 Seeding 'Coming Soon' movies...");

    for (const movie of COMING_SOON_MOVIES) {
        // Generate a placeholder image URL or use a default one
        // For now, we use a generic placeholder or existing asset pattern
        // In a real scenario, we would generate these images. 
        // We'll use a random existing image or a dedicated placeholder if available.
        // Let's assume we have a placeholder.
        const posterUrl = `https://layerfilm.com/assets/placeholders/${movie.genre.toLowerCase()}.jpg`;

        const { error } = await supabase
            .from('ideas') // Assuming 'ideas' is the table for films/videos
            .insert({
                title: movie.title,
                description: movie.description,
                category: movie.genre,
                tags: movie.tags,
                views: Math.floor(Math.random() * 1000),
                likes: Math.floor(Math.random() * 500),
                video_url: null, // No video yet
                image_url: posterUrl,
                user_id: 'admin-seeder', // Placeholder UUID
                status: 'coming_soon' // Assuming we added this column or we interpret it via category
            });

        if (error) {
            console.error(`❌ Failed to insert ${movie.title}:`, error.message);
        } else {
            console.log(`✅ Added: ${movie.title}`);
        }
    }

    console.log("✨ Seeding Complete!");
}

seed();
