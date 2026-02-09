"use server";

import { createClient } from "@/utils/supabase/server";
import { getIdeaById } from "@/lib/data";
import { revalidatePath } from "next/cache";

// Persistent database check
async function hasPurchased(id: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('idea_id', id)
        .single();

    return !!data && !error;
}

export async function getIdeaPublic(id: string) {
    const idea = await getIdeaById(id);
    if (!idea) return null;

    // Return only safe public data
    const { privateContent, ...publicData } = idea;
    const isUnlocked = await hasPurchased(id);

    return {
        ...publicData,
        isUnlocked,
    };
}

export async function getPrivateContent(id: string) {
    const isUnlocked = await hasPurchased(id);

    if (!isUnlocked) {
        throw new Error("Unauthorized: You must purchase this idea to view content.");
    }

    const idea = await getIdeaById(id);
    if (!idea) return null;

    return idea.privateContent;
}

export async function purchaseIdea(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Authentication required" };
    }

    // Insert into purchases table
    const { error } = await supabase
        .from('purchases')
        .insert({ user_id: user.id, idea_id: id });

    if (error && error.code !== '23505') { // Ignore unique constraint violations (already purchased)
        console.error("[Actions] purchaseIdea failed:", error.message);
        return { success: false, error: error.message };
    }

    revalidatePath(`/idea/${id}`);
    revalidatePath("/library");
    revalidatePath("/mylist");

    return { success: true };
}
