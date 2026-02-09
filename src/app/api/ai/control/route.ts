import { NextRequest, NextResponse } from "next/server";
import { interpretCommand } from "@/lib/gemini";
import { updateIdeaTitle } from "@/app/actions/admin";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { command } = body;

        if (!command) {
            return NextResponse.json({ error: "Command is required" }, { status: 400 });
        }

        // 1. Interpret with Gemini
        const interpretation = await interpretCommand(command);
        console.log("AI Interpretation:", interpretation);

        // 2. Execute Action
        if (interpretation.action === "updateTitle") {
            const { id, newTitle } = interpretation.parameters;
            const result = await updateIdeaTitle(id, newTitle);
            return NextResponse.json({
                message: `Updated title for item ${id} to ${newTitle}`,
                data: result
            });
        }

        return NextResponse.json({
            message: "Command not recognized or supported yet.",
            interpretation
        });

    } catch (error) {
        console.error("AI Control Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
