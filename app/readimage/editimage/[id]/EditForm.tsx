// app/edit/[id]/EditForm.tsx
"use client";

import { useActionState, useState } from "react";
import { update, FormState } from "@/app/actions/crudimage";

// ---------- EDIT FORM COMPONENT ----------
interface Record {
  id: number;
  name: string;
  address: string;
  dob: string;
  comment: string;
  image: string | null;
}

const initialState: FormState = { success: false, message: "" }; // Specify the initial state for the form

export default function EditForm({ record }: { record: Record }) {
  const updateWithId = update.bind(null, record.id);
  const [state, formAction, isPending] = useActionState(updateWithId, initialState);
  const [preview, setPreview] = useState<string | null>(record.image);

  // Handle image file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="existingImage" value={record.image || ""} />

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" defaultValue={record.name} className="w-full border rounded px-3 py-2" />
        {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input name="address" defaultValue={record.address} className="w-full border rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input
          type="date"
          name="dob"
          defaultValue={record.dob?.slice(0, 10)}
          className="w-full border rounded px-3 py-2"
        />
        {state.errors?.dob && <p className="text-red-500 text-sm">{state.errors.dob}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          name="comment"
          defaultValue={record.comment}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        {preview && (
          <img src={preview} alt="Current" className="mb-2 w-32 h-32 object-cover rounded" />
        )}
        <input
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImageChange}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current image</p>
      </div>

      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}