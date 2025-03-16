import { google } from "@ai-sdk/google";
import { jsonSchema, streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

const systemPrompt = `You are given an initial conversation from a user and an AI LLM agent. You must summarise the content in 4-5 words`;

export async function POST(req: Request) {
  const { messages, tools } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash"),
    messages,
    // forward system prompt and tools from the frontend
    system: systemPrompt,
    tools: Object.fromEntries(
      Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
        name,
        {
          parameters: jsonSchema(tool.parameters!),
        },
      ]),
    ),
  });

  return result.toDataStreamResponse();
}
