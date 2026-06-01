"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";

type Props = {
  id: string;
};

async function fetchNoteById(id: string): Promise<Note> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load note");
  }

  return res.json();
}

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading note...</p>}

      {isError && <p>{(error as Error).message || "Failed to load note."}</p>}

      {!isLoading && !isError && data && (
        <article>
          <h2>{data.title}</h2>
          <p>{data.content}</p>
          <p>Tag: {data.tag}</p>
          <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
        </article>
      )}
    </Modal>
  );
}
