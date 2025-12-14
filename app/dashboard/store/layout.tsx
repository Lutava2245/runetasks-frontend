'use client';

import { RewardProvider } from "@/src/contexts/RewardContext";

export default function StoreLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RewardProvider>
      <div>
        {children}
      </div>
    </RewardProvider>
  )
}