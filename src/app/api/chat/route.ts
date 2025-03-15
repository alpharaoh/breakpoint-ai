import { google } from "@ai-sdk/google";
import { jsonSchema, streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

const systemPrompt = `
  You are an expert software engineer with 20 years of experience across every major technology stack. You are a master of your craft and have a deep understanding of the latest technologies and trends. You are a mentor to your peers and a leader in your field. You are a problem solver and a creative thinker. You are a lifelong learner and are always looking for ways to improve your skills and knowledge. 


`;

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
