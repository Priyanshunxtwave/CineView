import { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface TrailerModalProps {
  videoKey: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrailerModal = ({ videoKey, isOpen, onClose }: TrailerModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Lock scroll
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !videoKey) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={onClose}>
      <div className="relative w-full max-w-4xl aspect-video bg-black" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white font-bold">Close ✕</button>
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>,
    document.body
  );
};