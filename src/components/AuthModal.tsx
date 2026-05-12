import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Button from './ui/Button';
import { X } from 'lucide-react';
import Card from './ui/Card';
import Link from 'next/link';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card
        className="p-8 rounded-xl w-full max-w-md m-4 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Faça Login' : 'Cadastre-se'}
          </h2>
          <Button
            variant='ghost'
            onClick={onClose}
            className="leading-none"
          >
            <X />
          </Button>
        </div>

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}

        <div className="mt-3 text-center text-sm">
          <div className='mb-3'>
            {mode === 'login' ? (
              <p>
                Não tem uma conta?
                <Button
                  variant="outline"
                  onClick={() => setMode('register')}
                  className='ml-3'
                >
                  Cadastre-se
                </Button>
              </p>
            ) : (
              <p>
                Já tem uma conta?
                <Button
                  variant="outline"
                  onClick={() => setMode('login')}
                  className='ml-3'
                >
                  Faça Login
                </Button>
              </p>
            )}
          </div>
          {mode === 'login' && (
            <div>
              <Link href={"/forgot-password"}>
                <p className='text-(--secondary) underline'>Esqueci minha senha</p>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}