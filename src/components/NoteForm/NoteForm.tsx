import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().optional(),
  tag: Yup.string().oneOf(['Work', 'Personal', 'Shopping']).required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  // Мутация создания заметки и обновление списка
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  const formik = useFormik({
    initialValues: { title: '', content: '', tag: 'Work' as const },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={css.form}>
      {/* Поле Title */}
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          className={css.input}
        />
        {formik.touched.title && formik.errors.title ? (
          <div className={css.error}>{formik.errors.title}</div>
        ) : null}
      </div>

      {/* Поле Content */}
      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content}
          className={css.textarea}
        />
      </div>

      {/* Поле Tag */}
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tag}
          className={css.select}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {/* Блок кнопок внизу формы */}
      <div className={css.actions}>
        <button type="button" onClick={onClose} className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" disabled={mutation.isPending} className={css.submitButton}>
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}