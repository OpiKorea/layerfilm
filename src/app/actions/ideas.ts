"use server";

import { getIdeas as getIdeasInternal } from "@/lib/data";

export async function getIdeas(query?: string) {
    return await getIdeasInternal(query);
}
