"use client";

import { useTransition } from "react";
import { remove } from "@/app/actions/crudimage";

export default function DeleteButton({
  id,
  imagePath,
}: {
  id: number;
  imagePath: string | null;
}) {
  "use client";
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this record?")) return;
    startTransition(() => remove(id, imagePath));
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 text-sm hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
