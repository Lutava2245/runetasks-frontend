'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Home, ListChecks, Target, Store, User, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Tarefas', href: '/dashboard/tasks', icon: ListChecks },
  { name: 'Habilidades', href: '/dashboard/skills', icon: Target },
  { name: 'Loja', href: '/dashboard/store', icon: Store },
  { name: 'Perfil', href: '/dashboard/profile', icon: User },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-6 lg:hidden">
         <h1 className="text-xl font-bold text-blue-400">RuneTasks</h1>
         {onClose && (
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                &times;
            </button>
         )}
      </div>

      <nav className="space-y-2 grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href} passHref>
              <div
                onClick={onClose}
                className={clsx(
                  "flex items-center p-3 rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center p-3 mt-4 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
      >
         <LogOut className="h-5 w-5 mr-3" />
         <span className="font-medium">Sair</span>
      </button>
    </div>
  );
}