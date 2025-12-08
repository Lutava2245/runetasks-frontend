'use client';

import Sidebar from "@/src/components/Sidebar";
import { useAuth } from '@/src/contexts/AuthContext';
import { AvatarProvider } from "@/src/contexts/AvatarContext";
import { SkillProvider } from "@/src/contexts/SkillContext";
import { TaskProvider } from "@/src/contexts/TaskContext";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

            <aside className="lg:block w-64 bg-gray-900 shadow-2xl shrink-0">
              <Sidebar />
            </aside>

            <div className="grow flex flex-col">
              <header className="lg:hidden w-full bg-white shadow-md p-4 sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold text-blue-600">Dashboard</h1>
                  <button onClick={() => setIsDrawerOpen(true)} className="p-1">
                    <Menu className="w-6 h-6 text-gray-800" />
                  </button>
                </div>
              </header>

              <main className="grow p-4 lg:p-8">
                {children}
              </main>
            </div>

            {isDrawerOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                  onClick={() => setIsDrawerOpen(false)}
                />
                <div className="fixed top-0 left-0 h-full w-64 z-30 transform transition-transform duration-300 ease-in-out lg:hidden">
                  <Sidebar onClose={() => setIsDrawerOpen(false)} />
                </div>
              </>
            )}
          </div>
        </AvatarProvider>
      </SkillProvider>
    </TaskProvider>
  )
};