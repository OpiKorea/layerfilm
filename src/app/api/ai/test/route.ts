import { NextResponse } from "next/server";
import { testGeminiConnection } from "@/lib/gemini";

export async function GET() {
    try {
        const response = await testGeminiConnection();
        return NextResponse.json({
            success: true,
            message: "Gemini Connection verified!",
            aiResponse: response
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Failed to connect to Gemini",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
