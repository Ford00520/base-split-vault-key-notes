'use client'

import { useEffect, useRef } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { BASE_AUTO_CONNECT_DISMISSED_KEY } from './WalletButton'

type WalletProvider = {
  isCoinbaseWallet?: true
  providers?: WalletProvider[]
}

function hasCoinbaseInjectedProvider(provider?: WalletProvider) {
  if (!provider) return false
  if (provider.isCoinbaseWallet) return true
  return provider.providers?.some((item) => item.isCoinbaseWallet) ?? false
}

function isBaseEmbeddedBrowser() {
  if (typeof window === 'undefined') return false

  const provider = window.ethereum as WalletProvider | undefined
  const userAgent = window.navigator.userAgent.toLowerCase()

  return (
    hasCoinbaseInjectedProvider(provider) &&
    (userAgent.includes('coinbase') || userAgent.includes('base'))
  )
}

export function BaseAppAutoConnect() {
  const attempted = useRef(false)
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    if (attempted.current || isConnected || !isBaseEmbeddedBrowser()) return
    if (window.localStorage.getItem(BASE_AUTO_CONNECT_DISMISSED_KEY) === 'true') return

    const injectedConnector = connectors.find((connector) => connector.type === 'injected')
    if (!injectedConnector) return

    attempted.current = true
    connect({ connector: injectedConnector })
  }, [connect, connectors, isConnected])

  return null
}
