// app/actions/crud.ts
"use server";

import  db  from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "fs/promises"; // import necessary functions from fs/promises
import path from "path";

export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// ---------- helper: save uploaded file ----------
async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  // basic validation
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, or WEBP images are allowed");
  }
  // size of image
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be under 5MB");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name);
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeName);

  await writeFile(filePath, buffer);

  return `/uploads/${safeName}`;
}

async function deleteImage(imagePath: string | null) {
  if (!imagePath) return;
  try {
    await unlink(path.join(process.cwd(), "public", imagePath));
  } catch {
    // file already gone, ignore
  }
}

// ---------- CREATE ----------
export async function create(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = (formData.get("name") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const dob = formData.get("dob") as string;
  const comment = (formData.get("comment") as string)?.trim();
  const imageFile = formData.get("image") as File;

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required";
  if (!dob) errors.dob = "Date of birth is required";
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Please fix the errors below", errors };
  }

  let imagePath: string | null = null;

  try {
    imagePath = await saveImage(imageFile);

    await db.query(
      `INSERT INTO crudimage (name, address, dob, comment, image) VALUES (?, ?, ?, ?, ?)`,
      [name, address, dob, comment, imagePath]
    );
  } catch (err: any) {
    console.error("Create failed:", err.message);
    return { success: false, message: err.message || "Something went wrong" };
  }

  revalidatePath("/readimage");
  redirect("/readimage");
}

// ---------- UPDATE ----------
export async function update(
  id: number,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = (formData.get("name") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const dob = formData.get("dob") as string;
  const comment = (formData.get("comment") as string)?.trim();
  const imageFile = formData.get("image") as File;
  const existingImage = formData.get("existingImage") as string;

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required";
  if (!dob) errors.dob = "Date of birth is required";
  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Please fix the errors below", errors };
  }

  let imagePath = existingImage || null;

  try {
    // only replace image if a new one was uploaded
    if (imageFile && imageFile.size > 0) {
      const newImagePath = await saveImage(imageFile);
      if (newImagePath) {
        await deleteImage(existingImage); // clean up old file
        imagePath = newImagePath;
      }
    }

    await db.query(
      `UPDATE crud SET name=?, address=?, dob=?, comment=?, image=? WHERE id=?`,
      [name, address, dob, comment, imagePath, id]
    );
  } catch (err: any) {
    console.error("Update failed:", err.message);
    return { success: false, message: err.message || "Something went wrong" };
  }

  revalidatePath("/read");
  redirect("/read");
}

// ---------- DELETE ----------
export async function remove(id: number, imagePath: string | null) {
  try {
    await db.query("DELETE FROM crudimage WHERE id=?", [id]);
    await deleteImage(imagePath);
  } catch (err: any) {
    console.error("Delete failed:", err.message);
    throw new Error("Failed to delete record");
  }

  revalidatePath("/read");
}


export async function getById(id: number) {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM crudimage WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: "Record not found",
      };
    }

    return {
      success: true,
      data: rows[0],
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}