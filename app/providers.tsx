'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { BaseAppAutoConnect } from '@/components/BaseAppAutoConnect'
import { wagmiConfig } from '@/lib/wagmi'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BaseAppAutoConnect />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
