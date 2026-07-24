// lib/encryption.ts
import "server-only";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes (64 hex chars)

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12); // random IV per encryption — never reuse
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // pack iv + authTag + encrypted data together so we can decrypt later
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}


export function decrypt(payload: string | null | undefined): string {
  if (!payload) return "";

  try {
    const data = Buffer.from(payload, "base64");

    // sanity check: encrypted payloads must be at least iv(12) + authTag(16) bytes
    if (data.length < 28) {
      return payload; // too short to be encrypted — probably legacy plain text
    }

    const iv = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const encrypted = data.subarray(28);

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (err) {
    console.error("Decryption failed for payload:", payload, err);
    return "[unable to decrypt]"; // fail gracefully instead of crashing the page
  }
}

// export function decrypt(payload: string): string {
//   const data = Buffer.from(payload, "base64");

//   const iv = data.subarray(0, 12);
//   const authTag = data.subarray(12, 28);
//   const encrypted = data.subarray(28);

//   const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
//   decipher.setAuthTag(authTag);

//   const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
//   return decrypted.toString("utf8");
// }