"use client";

import { useEffect, useReducer } from "react";
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

type State = {
  currentPage: number;
  search: string;
  isModalOpen: boolean;
  currentTag: string;
};

type Action =
  | { type: "setSearch"; payload: string }
  | { type: "setPage"; payload: number }
  | { type: "openModal" }
  | { type: "closeModal" }
  | { type: "setTag"; payload: string };

const PER_PAGE = 12;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setSearch":
      return {
        ...state,
        search: action.payload,
        currentPage: 1,
      };

    case "setPage":
      return {
        ...state,
        currentPage: action.payload,
      };

    case "openModal":
      return {
        ...state,
        isModalOpen: true,
      };

    case "closeModal":
      return {
        ...state,
        isModalOpen: false,
      };

    case "setTag":
      return {
        ...state,
        currentTag: action.payload,
        currentPage: 1,
      };

    default:
      return state;
  }
}

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
  const [state, dispatch] = useReducer(reducer, {
    currentPage: 1,
    search: "",
    isModalOpen: false,
    currentTag: tag,
  });

  const [debouncedSearch] = useDebounce(state.search, 300);

  useEffect(() => {
    if (state.currentTag !== tag) {
      dispatch({ type: "setTag", payload: tag });
    }
  }, [tag, state.currentTag]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "notes",
      {
        page: state.currentPage,
        search: debouncedSearch,
        tag: state.currentTag,
      },
    ],
    queryFn: () =>
      fetchNotes({
        page: state.currentPage,
        search: debouncedSearch,
        tag: state.currentTag,
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
        <SearchBox
          value={state.search}
          onChange={(value: string) =>
            dispatch({ type: "setSearch", payload: value })
          }
        />

        <button type="button" onClick={() => dispatch({ type: "openModal" })}>
          Create note
        </button>
      </div>

      {isLoading && <p>Loading notes...</p>}

      {isError && <p>{(error as Error).message || "Failed to load notes."}</p>}

      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {totalPages > 1 && (
        <Pagination
          currentPage={state.currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) =>
            dispatch({ type: "setPage", payload: page })
          }
        />
      )}

      {state.isModalOpen && (
        <Modal onClose={() => dispatch({ type: "closeModal" })}>
          <NoteForm onClose={() => dispatch({ type: "closeModal" })} />
        </Modal>
      )}
    </section>
  );
}
