'use client';

import Sidebar from "@/src/components/Sidebar";
import { useAuth } from '@/src/contexts/AuthContext';
import { AvatarProvider } from "@/src/contexts/AvatarContext";
import { SkillProvider } from "@/src/contexts/SkillContext";
import { TaskProvider } from "@/src/contexts/TaskContext";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import logo from "@/src/assets/logo.png";
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import clsx from "clsx";
import { useIsLargeScreen } from "@/src/hooks/useMediaQuery";

export default function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const isLargeScreen = useIsLargeScreen();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold">Carregando Dashboard...</p>
      </div>
    );
  }

  return (
    <TaskProvider>
      <SkillProvider>
        <AvatarProvider>
          <div className="flex min-h-screen bg-gray-50">
            {isLargeScreen && (
              <aside
                style={{ width: isDrawerCollapsed ? '80px' : '256px' }} // CSS Inline é infalível
                className="bg-gray-900 text-white fixed inset-y-0 left-0 z-50 transition-all duration-300 flex flex-col"
              >
                <Sidebar
                  isCollapsed={isDrawerCollapsed}
                  onToggle={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
                />
              </aside>
            )}

            <div className={clsx(
              "flex flex-col flex-1 transition-all duration-300",
              "lg:ml-20",
              !isDrawerCollapsed && "lg:ml-64"
            )}>
              <header className="lg:hidden flex items-center justify-between p-4 bg-gray-900 shadow-sm">
                <div className="flex items-center space-x-2 text-xl font-bold hover:text-blue-800 transition duration-150">
                  <h1 className="text-xl font-bold text-white">RuneTasks</h1>
                  <Image
                    src={logo}
                    alt="Logo RuneTasks"
                    width={32}
                    height={32}
                  />
                </div>
                <button onClick={() => setIsDrawerOpen(true)} className="p-1 order-first">
                  <Menu className="w-6 h-6" />
                </button>
              </header>

              <main className="grow p-4 lg:p-8">
                {children}
              </main>
            </div>

            {isDrawerOpen && (
              <div className="fixed inset-0 z-40 lg:hidden">
                <div
                  className="fixed inset-0 bg-black/50 transition-opacity"
                  onClick={() => setIsDrawerOpen(false)}
                />

                <div className="fixed top-0 left-0 h-full w-64 z-50 bg-gray-900 shadow-xl transform transition-transform duration-300">
                  <Sidebar onClose={() => setIsDrawerOpen(false)} />
                </div>
              </div>
            )}
          </div>
        </AvatarProvider>
      </SkillProvider>
    </TaskProvider>
  )
};