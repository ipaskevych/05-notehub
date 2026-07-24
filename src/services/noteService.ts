import axios from 'axios';
import type { Note, NewNote } from '../types/note';
// Перенесено сюда по требованию ментора
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const noteApi = axios.create({
  baseURL: import.meta.env.VITE_NOTEHUB_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (page: number, perPage: number, search: string): Promise<FetchNotesResponse> => {
  const response = await noteApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search: search.trim() ? search : undefined,
    },
  });
  return response.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const response = await noteApi.post<Note>('/notes', note);
  return response.data;
};

// ИСПРАВЛЕНО: Теперь возвращает Promise<Note> вместо void
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await noteApi.delete<Note>(`/notes/${id}`);
  return response.data;
};