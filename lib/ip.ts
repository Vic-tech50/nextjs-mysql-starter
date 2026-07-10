import { headers } from "next/headers";

export async function getClientIp() {
  const h = await headers();

  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "127.0.0.1"
  );
}