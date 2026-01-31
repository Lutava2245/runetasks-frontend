import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { Toaster } from "sonner";
import { AlertCircle, Ban, CheckCircle2, Info } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RuneTasks",
  description: "RuneTasks: Gerencie suas tarefas de forma engajante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          toastOptions={{
            classNames: {
              toast: '!bg-(--card) !border-2 !rounded-full !shadow-xl !text-sm',
              title: '!text-(--foreground) !font-bold',
              description: '!text-(--foreground) !opacity-80',
              success: '!border-(--secondary)',
              error: '!border-(--error) !text-(--error)',
              info: '!border-(--primary)',
              warning: '!border-(--warning)'
            }
          }}
          icons={{
            success: <CheckCircle2 size={20} color="var(--secondary)" />,
            error: <AlertCircle size={20} color="var(--error)" />,
            info: <Info size={20} color="var(--primary)" />,
            warning: <Ban size={20} color="var(--warning)" />,
          }}
        />
      </body>
    </html>
  );
}
