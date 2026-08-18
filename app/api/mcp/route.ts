// app/api/mcp/route.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import  db  from "@/lib/db";

const server = new McpServer({ name: "crud-app-mcp", version: "1.0.0" });

// Tool 1: search records
server.tool(
  "search_records",
  "Search records by name or address",
  { query: z.string().describe("Name or address to search for") },
  async ({ query }) => {
    const [rows]: any = await db.query(
      "SELECT id, name, address, dob FROM crud WHERE name LIKE ? OR address LIKE ?",
      [`%${query}%`, `%${query}%`]
    );

    return {
      content: [{ type: "text", text: JSON.stringify(rows) }],
    };
  }
);

// Tool 2: create a record
server.tool(
  "create_record",
  "Create a new record",
  {
    name: z.string(),
    address: z.string().optional(),
    dob: z.string().describe("Date of birth in YYYY-MM-DD format"),
    comment: z.string().optional(),
  },
  async ({ name, address, dob, comment }) => {
    const [result]: any = await db.query(
      "INSERT INTO crud (name, address, dob, comment) VALUES (?, ?, ?, ?)",
      [name, address ?? null, dob, comment ?? null]
    );

    return {
      content: [{ type: "text", text: `Created record #${result.insertId} for ${name}` }],
    };
  }
);

// Tool 3: delete a record
server.tool(
  "delete_record",
  "Delete a record by ID",
  { id: z.number() },
  async ({ id }) => {
    await db.query("DELETE FROM crud WHERE id=?", [id]);
    return { content: [{ type: "text", text: `Deleted record #${id}` }] };
  }
);

// server.tool(
//   "delete_record",
//   "Delete a record by ID — ALWAYS confirm the exact record with the user first via search_records before calling this",
//   { id: z.number() },
//   async ({ id }) => { /* ... */ }
// );

export async function POST(req: Request) {
  const transport = new StreamableHTTPServerTransport();
  await server.connect(transport);
  return transport.handleRequest(req);
}