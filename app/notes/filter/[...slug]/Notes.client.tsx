"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import type { Note } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

type Props = {
  tag: string;
};

const PER_PAGE = 12;

async function fetchNotes({
  page,
  search,
  tag,
}: {
  page: number;
  search: string;
  tag: string;
}): Promise<NotesResponse> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("perPage", String(PER_PAGE));

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (tag !== "all") {
    params.set("tag", tag);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notes?${params.toString()}`,
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to load notes");
  }

  return res.json();
}

export default function NotesClient({ tag }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(inputValue, 300);

  const effectivePage = debouncedSearch || tag !== "all" ? 1 : currentPage;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", { page: effectivePage, search: debouncedSearch, tag }],
    queryFn: () =>
      fetchNotes({
        page: effectivePage,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: (previousData) => previousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <SearchBox value={inputValue} onChange={setInputValue} />
        <button type="button" onClick={() => setIsModalOpen(true)}>
          Create note
        </button>
      </div>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>{(error as Error).message || "Failed to load notes."}</p>}

      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {totalPages > 1 && (
        <Pagination
          currentPage={effectivePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </section>
  );
}
