import { GoogleGenerativeAI } from "@google/generative-ai";

// CAUTION: process.env.GEMINI_API_KEY must be set in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// User requested 'gemini-3-flash-preview' for speed
export const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export async function interpretCommand(command: string) {
  const prompt = `
    You are the **Master Operating Agent** of 'LayerFilm'.
    You have **ROOT AUTHORITY** to modify the platform's data.

    Your capabilities:
    1. updatePrice(id: string, newPrice: number) - Update the price of an idea.
    2. unknown() - If the command is not understood or supported.

    **Instructions:**
    - Analyze the user's natural language command deeply.
    - Infer missing details (e.g., if "first item" is said, map to id: "1").
    - You are decisive.

    User Command: "${command}"

    Return ONLY a JSON object:
    {
      "action": "updatePrice" | "unknown",
      "parameters": {
        "id": "1",
        "newPrice": 10
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini interpretation failed, falling back to regex simulation:", error);

    // Fallback: Simple Regex Parser for Demo purposes
    // Allows the user to test the flow even if the API Key is invalid
    const lowerCmd = command.toLowerCase();

    // Pattern: "change price of [id] to [price]" or "update [id] price [price]"
    // Simple heuristic for "item 1" -> "1"

    if (lowerCmd.includes("price") && (lowerCmd.includes("change") || lowerCmd.includes("update") || lowerCmd.includes("set"))) {
      // Find ID - simplistic assumption: if they say "item 1", "idea 1"
      const idMatch = lowerCmd.match(/(item|idea)\s?(\d+)/) || lowerCmd.match(/id\s?(\d+)/);

      // If "first" or "1st", use "1"
      const id = (lowerCmd.includes("first") || lowerCmd.includes("1st")) ? "1" : (idMatch ? idMatch[2] : "1");

      // Find the LAST number which is likely the price
      const numbers = lowerCmd.match(/\d+/g);
      const newPrice = numbers ? parseInt(numbers[numbers.length - 1]) : 50; // Default to 50 if parsing fails

      console.log(`[Simulation] Parsed: ID=${id}, Price=${newPrice}`);

      return {
        action: "updatePrice",
        parameters: {
          id: id,
          newPrice: newPrice
        }
      };
    }

    return { action: "unknown" };
  }
}

export async function testGeminiConnection() {
  console.log("Testing Gemini Connection with Master Key...");
  try {
    const prompt = "LayerFilm 운영 권한 확인. 시스템 상태 보고해.";
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini connection test failed:", error);
    throw error;
  }
}
