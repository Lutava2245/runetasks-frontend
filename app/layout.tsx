import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { Toaster } from "sonner";
import { AlertCircle, Ban, CheckCircle2, Info } from "lucide-react";
import ReactQueryProvider from "@/src/providers/ReactQueryProvider";

const geistSans = Exo_2({
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
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
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>
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
