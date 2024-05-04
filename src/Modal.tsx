import { ReactNode } from 'react';
import './Modal.css';

type ModalProps = {
  children: ReactNode
  closeModal: () => void
}

function Modal({ children, closeModal }: ModalProps) {
  return (
    <div className='modal'>
      <div className="modal-content">
        <span className="close" onClick={() => closeModal()}>&times;</span>
        {children}
      </div>
    </div>);
}

export default Modal;