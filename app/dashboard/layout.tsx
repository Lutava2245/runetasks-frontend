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
import { Menu, X } from 'lucide-react';
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
                style={{ width: isDrawerCollapsed ? '80px' : '256px' }}
                className="bg-gray-900 text-white fixed inset-y-0 left-0 z-40 transition-all duration-300 flex flex-col"
              >
                <Sidebar
                  isCollapsed={isDrawerCollapsed}
                  onToggle={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
                />
              </aside>
            )}

            <div className="flex flex-col flex-1"
              style={{ marginLeft: isLargeScreen ? (isDrawerCollapsed ? '80px' : '256px') : '0' }}
            >
              {!isLargeScreen && (
                <header className="flex items-center justify-between p-4 bg-gray-900 shadow-sm sticky top-0 z-110">
                  <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="p-1 z-120">
                    {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-white">RuneTasks</h1>
                    <Image src={logo} alt="Logo" width={32} height={32} />
                  </div>
                </header>
              )}

              <main className="grow p-4 lg:p-8">
                {children}
              </main>
            </div>

            {!isLargeScreen && (
              <div className={clsx(
                "fixed inset-0 z-100",
                isDrawerOpen ? "visible" : "invisible delay-500"
              )}>
                <div
                  className={clsx(
                    "fixed inset-0 bg-black/50 transition-opacity duration-300",
                    isDrawerOpen ? "opacity-100" : "opacity-0"
                  )}
                  onClick={() => setIsDrawerOpen(false)}
                />
                <div className={clsx(
                  "fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-2xl z-100 transform transition-transform duration-500 ease-in-out",
                  isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                )}>
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