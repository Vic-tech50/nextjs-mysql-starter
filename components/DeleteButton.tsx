"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { remove } from "@/app/actions/crud";

export default function DeleteButton({
  id,
}: {
  id: number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await remove(id);

      if (result.success) {
        alert(result.message);
        router.refresh(); // Refresh the current page
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}