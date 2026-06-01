import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

type FetchNotesParams = {
  page: number;
  perPage: number;
  search: string;
  tag: string;
};

async function fetchNotes({ page, perPage, search, tag }: FetchNotesParams) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("perPage", String(perPage));

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (tag !== "all") {
    params.set("tag", tag);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notes?${params.toString()}`,
    {
      cache: "no-store",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
}

export default async function FilterPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0] ?? "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { page: 1, search: "", tag }],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
