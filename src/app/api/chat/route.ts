import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { chatSystemPrompt } from "@/lib/prompts";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    system: chatSystemPrompt,
  });

  return result.toDataStreamResponse();
}
