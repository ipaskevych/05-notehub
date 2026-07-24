import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

// Здесь мы четко говорим TypeScript, что модалка принимает любые элементы (children)
interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const modalRoot = document.querySelector('#modal-root') || document.body;

export default function Modal({ onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) onClose();
  };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}