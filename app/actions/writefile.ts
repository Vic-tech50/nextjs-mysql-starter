"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveNote(formData: FormData) {
  const content = formData.get("content") as string;

  const dir = path.join(process.cwd(), "public");
  await mkdir(dir, { recursive: true }); // ensure folder exists

  const filePath = path.join(dir, "notes.txt");
  await writeFile(filePath, content, "utf-8");

  return { success: true };
}