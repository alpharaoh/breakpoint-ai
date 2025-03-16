import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

const systemPrompt = `You are given an initial conversation from a user and an AI LLM agent. You must summarise the content in 3-4 words`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Extract only the first user message
  const firstMessage = messages.find(
    (msg: { role: string }) => msg.role === "user",
  );
  if (!firstMessage) {
    return new Response("No user message found", { status: 400 });
  }

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages: [{ role: "system", content: systemPrompt }, firstMessage],
  });

  return result.toDataStreamResponse();
}
