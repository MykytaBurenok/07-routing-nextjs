import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const noteHubApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await noteHubApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== "all" ? { tag } : {}),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await noteHubApi.get<Note>(`/notes/${id}`);

  return response.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response = await noteHubApi.post<Note>("/notes", payload);

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await noteHubApi.delete<Note>(`/notes/${id}`);

  return response.data;
};
