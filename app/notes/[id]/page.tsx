import { fetchNoteById } from "@/lib/api";

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await fetchNoteById(params.id);

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{note.title}</h1>
      <p className="mt-4 whitespace-pre-wrap">{note.content}</p>
    </div>
  );
}
