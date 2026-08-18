// app/actions/assistant.ts
"use server";

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function askAssistant(messages: ChatMessage[]) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system:
      "You are a helpful assistant for managing records in this app. Use the available tools to search, create, or delete records when the user asks. Always confirm what you did in plain language.",
    messages,
    mcp_servers: [
      {
        type: "url",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mcp`,
        name: "crud-app-mcp",
      },
    ],
  } as any); // `as any` if mcp_servers isn't yet in the SDK's TS types for your installed version

  // Extract readable text + note any tool calls made, for transparency in the UI
  const textParts: string[] = [];
  const toolCalls: { name: string; input: any }[] = [];

  for (const block of response.content) {
    if (block.type === "text") textParts.push(block.text);
    if ((block as any).type === "mcp_tool_use") {
      toolCalls.push({ name: (block as any).name, input: (block as any).input });
    }
  }

  return {
    reply: textParts.join("\n"),
    toolCalls,
  };
}