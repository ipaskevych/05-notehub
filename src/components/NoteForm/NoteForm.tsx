import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import type { NewNote } from '../../types/note'; 
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().optional(),
  tag: Yup.string().oneOf(['Work', 'Personal', 'Shopping', 'Todo', 'Meeting']).required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Work' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        mutation.mutate(values as NewNote);
    
      }}
    >
      <Form className={css.form}>
        {/* Поле Title */}
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" type="text" className={css.input} />
          {/* ИСПРАВЛЕНО: Официальный компонент ErrorMessage по спецификации */}
          <ErrorMessage name="title" component="div" className={css.error} />
        </div>

        {/* Поле Content */}
        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field id="content" name="content" as="textarea" className={css.textarea} />
        </div>

        {/* Поле Tag */}
        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" name="tag" as="select" className={css.select}>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Todo">Todo</option>
            <option value="Meeting">Meeting</option>
          </Field>
          {/* ИСПРАВЛЕНО: Официальный компонент ErrorMessage для селекта */}
          <ErrorMessage name="tag" component="div" className={css.error} />
        </div>

        {/* Кнопки */}
        <div className={css.actions}>
          <button type="button" onClick={onClose} className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" disabled={mutation.isPending} className={css.submitButton}>
            {mutation.isPending ? 'Creating...' : 'Create note'}
          </button>
        </div>
      </Form>
    </Formik>
  );
}