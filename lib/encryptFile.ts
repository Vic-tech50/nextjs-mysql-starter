// lib/encryptFile.ts
//to encrypt uploaded file
import "server-only";
import crypto from "crypto";
import { readFile, writeFile } from "fs/promises";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export async function encryptFile(inputPath: string, outputPath: string) {
  const data = await readFile(inputPath);

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  await writeFile(outputPath, Buffer.concat([iv, authTag, encrypted]));
}

export async function decryptFile(inputPath: string): Promise<Buffer> {
  const data = await readFile(inputPath);

  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const encrypted = data.subarray(28);

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}