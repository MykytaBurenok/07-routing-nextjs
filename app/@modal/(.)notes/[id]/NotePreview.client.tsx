"use client";

import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function NotePreviewClient({ id }: { id: string }) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNote() {
      try {
        setLoading(true);
        const res = await fetch(`/api/notes/${id}`);
        const data = await res.json();
        setNote(data);
      } catch (e) {
        console.error("Failed to load note", e);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchNote();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!note) return <div>Note not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{note.title}</h2>
      <p className="mt-2 whitespace-pre-wrap">{note.content}</p>
    </div>
  );
}
