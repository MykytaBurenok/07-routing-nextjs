import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NotePreviewClient from "./NotePreview.client";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

async function fetchNoteById(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch note");
  }

  return res.json();
}

export default async function NoteModalPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
