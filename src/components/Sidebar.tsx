'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Home, ListChecks, Target, Store, User, LogOut, Menu } from 'lucide-react';
import Button from './ui/Button';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Tarefas', href: '/dashboard/tasks', icon: ListChecks },
  { name: 'Habilidades', href: '/dashboard/skills', icon: Target },
  { name: 'Loja', href: '/dashboard/store', icon: Store },
  { name: 'Perfil', href: '/dashboard/profile', icon: User },
];

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ onClose, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full py-4">
      <div className="flex items-center transition-all duration-300 overflow-hidden">
        <Button
          variant='ghost'
          onClick={onToggle || onClose}
          className="leading-none shrink-0 w-20 h-12 flex items-center justify-center cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className={clsx(
          "transition-all duration-300 ease-in-out whitespace-nowrap",
          isCollapsed ? "opacity-0 w-0" : "opacity-100 w-44"
        )}>
          <span className="font-bold text-xl whitespace-nowrap animate-in fade-in duration-300">RuneTasks</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href} onClick={onClose} passHref>
              <div
                className={clsx(
                  "flex items-center h-12 rounded-full transition-all duration-300 overflow-hidden",
                  isActive ? "bg-(--primary) text-white" : "hover:bg-(--primary)/25"
                )}
              >
                <div className="w-20 h-12 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>

                <div className={clsx(
                  "transition-all duration-300 ease-in-out whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0" : "opacity-100 w-44"
                )}>
                  <span className="font-medium">{item.name}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center transition-all duration-300 overflow-hidden">
        <button onClick={logout} className={clsx(
          "flex items-center w-full h-12 transition-all duration-300 overflow-hidden group",
          "text-red-700 hover:text-red-900 rounded-full cursor-pointer"
        )}
        >
          <div className="w-20 h-12 flex items-center justify-center shrink-0 ">
            <LogOut className="h-5 w-5" />
          </div>

          <div className={clsx(
            "transition-all duration-300 ease-in-out whitespace-nowrap text-left",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            <span className="font-bold whitespace-nowrap animate-in fade-in duration-300">Sair</span>
          </div>
        </button>
      </div>
    </div>
  );
}