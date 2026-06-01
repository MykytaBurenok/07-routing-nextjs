"use client";

import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
};

export default function NotesClient({ slug }: { slug?: string[] }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoading(true);

        const query = slug?.length ? `?filter=${slug.join(",")}` : "";
        const res = await fetch(`/api/notes${query}`);
        const data = await res.json();

        setNotes(data);
      } catch (e) {
        console.error("Failed to load notes", e);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [slug]);

  if (loading) return <div>Loading notes...</div>;

  if (!notes.length) return <div>No notes found</div>;

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div key={note.id} className="p-3 border rounded">
          {note.title}
        </div>
      ))}
    </div>
  );
}
