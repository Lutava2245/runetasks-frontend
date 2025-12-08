'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Button from './Button';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'login' ? 'Faça Login' : 'Cadastre-se'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-3xl leading-none">
            &times;
          </button>
        </div>

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Button
                variant="secondary"
                onClick={() => setMode('register')}
              >
                Cadastre-se
              </Button>
            </p>
          ) : (
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Button
                variant="secondary"
                onClick={() => setMode('login')}
              >
                Faça Login
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}