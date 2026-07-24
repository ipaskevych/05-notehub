import axios from 'axios';
import type { Note, NewNote, FetchNotesResponse } from '../types/note';

const noteApi = axios.create({
  baseURL: import.meta.env.VITE_NOTEHUB_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async (page: number, perPage: number, search: string) => {
  const response = await noteApi.get<FetchNotesResponse>('/notes', {
    params: {
      page: page,         // Подставит текущую страницу (из ссылки №2)
      perPage: perPage,   // Подставит 12 (из ссылки №2)
      // Если инпут пустой, параметр поиска вообще не отправится (и бэкенд вернет все заметки)
      search: search.trim() ? search : undefined, 
    },
  });
  return response.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const response = await noteApi.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await noteApi.delete(`/notes/${id}`);
};

