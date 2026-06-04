import type { Hex } from 'viem'
import { http, createConfig, injected } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const BUILDER_CODE = 'bc_sfqqlhf8'
export const BUILDER_CODE_SUFFIX =
  '0x62635f736671716c6866380b0080218021802180218021802180218021' as Hex

export const attributionDataSuffix =
  BUILDER_CODE_SUFFIX.length > 0 ? (BUILDER_CODE_SUFFIX as Hex) : undefined

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 500
    }),
    coinbaseWallet({
      appName: 'Key Notes Vault',
      preference: 'all',
      version: '4'
    })
  ],
  dataSuffix: attributionDataSuffix,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  },
  ssr: true
})
