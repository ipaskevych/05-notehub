import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox'; 
import Pagination from '../Pagination/Pagination';
import css from './App.module.css';

const PER_PAGE = 12;

export default function App() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Дебаунс для поиска (запрос пойдет через 500мс после окончания ввода)
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // Сбрасываем на 1 страницу при новом поиске
  }, 500);

  // Получение данных
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, PER_PAGE, search),
  });

  // Мутация на создание заметки
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  // Мутация на удаление заметки
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={debouncedSearch} />
        
          {data && data.totalPages > 1 && (
  <Pagination
    pageCount={data.totalPages}
    forcePage={page - 1}
    onPageChange={(e) => setPage(e.selected + 1)}
  />
)}


        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Something went wrong. Please try again.</p>}
      
      {data && <NoteList notes={data.notes} onDelete={(id) => deleteMutation.mutate(id)} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSubmit={(values) => createMutation.mutate(values)} onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}