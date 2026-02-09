"use server";

import { updateMockIdea } from "@/lib/data";
import { IdeaItem } from "@/lib/types";

// 1. Check AI Authority
// In a real environment, this would verify a secure token passed by the AI Agent
export async function checkAIAuthority(secretKey: string): Promise<boolean> {
    const ADMIN_SECRET = process.env.ADMIN_SECRET || "gemini-admin-key";

    if (secretKey === ADMIN_SECRET) {
        ("[Admin] AI Authority Verified.");
        return true;
    }

    console.warn("[Admin] AI Authority Failed.");
    return false;
}

// CMS-style Update Function
export async function updateIdeaTitle(id: string, newTitle: string) {
    const updated = await updateMockIdea(id, { title: newTitle });

    if (updated) {
        (`[Admin] Updated title for ${id} to ${newTitle}`);
        return { success: true, idea: updated };
    }

    return { success: false, error: "Idea not found" };
}
