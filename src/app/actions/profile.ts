
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(userId: string, updates: { username?: string; avatar_url?: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/(main)"); // To update navbar etc.
    return { success: true, profile: data };
}
