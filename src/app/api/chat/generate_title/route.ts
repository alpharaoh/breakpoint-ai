import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { titleGenerationPrompt } from "@/lib/prompts";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Extract only the first user message
  const firstMessage = messages.find(
    (msg: { role: string }) => msg.role === "user"
  );
  if (!firstMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const result = await generateText({
    model: google("gemini-2.0-flash"),
    messages: [
      { role: "system", content: titleGenerationPrompt },
      firstMessage,
    ],
  });

  return new Response(result.text);
}
