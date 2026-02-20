import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import Card from './Card';
import Button from './Button';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const CelebrationModal = ({ isOpen, onClose, title, description }: CelebrationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8a2ce2', '#008800', '#4b0082'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" onClick={onClose} />

      <Card className="relative bg-background border-2 border-(--dark-primary) p-8 max-w-sm text-center shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)]">
        <h2 className="text-2xl font-bold mb-2 animate-bounce">
          {title}
        </h2>
        <p className="text-(--secondary) mb-6">{description}</p>

        <Button
          onClick={onClose}
          className="rounded-full active:scale-95 w-full"
        >
          Ok
        </Button>
      </Card>
    </div>
  );
};