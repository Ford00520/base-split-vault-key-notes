'use client'

import { Check, ChevronDown, PlugZap, Unplug, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const BASE_AUTO_CONNECT_DISMISSED_KEY = 'key-notes-base-auto-connect-dismissed'

function readableConnectorName(name: string) {
  const lower = name.toLowerCase()

  if (lower.includes('coinbase')) return 'Coinbase Wallet'
  if (lower.includes('meta')) return 'MetaMask'
  if (lower.includes('okx') || lower.includes('okex')) return 'OKX Wallet'
  if (lower.includes('injected')) return 'Browser Wallet'

  return name
}

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending, variables } = useConnect()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)

  const walletOptions = useMemo(() => {
    const seen = new Set<string>()

    return connectors.filter((connector) => {
      const key = `${connector.type}-${connector.name}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [connectors])

  const connectedLabel = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'

  return (
    <div className="wallet-menu">
      <button
        aria-expanded={isOpen}
        className={`wallet-button${isConnected ? ' connected' : ''}`}
        disabled={!isConnected && walletOptions.length === 0}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {isConnected ? <Wallet size={16} /> : <PlugZap size={16} />}
        <span>{isConnected ? connectedLabel : 'Connect Wallet'}</span>
        <ChevronDown size={15} />
      </button>

      {isOpen ? (
        <div className="wallet-popover" role="menu">
          {isConnected ? (
            <button
              className="wallet-option danger"
              onClick={() => {
                disconnect()
                window.localStorage.setItem(BASE_AUTO_CONNECT_DISMISSED_KEY, 'true')
                setIsOpen(false)
              }}
              role="menuitem"
              type="button"
            >
              <Unplug size={16} />
              <span>Disconnect Wallet</span>
            </button>
          ) : null}

          {!isConnected ? (
            <div className="wallet-option-list">
              {walletOptions.map((connector) => {
                const pendingConnector = variables?.connector as { uid?: string } | undefined
                const isConnecting = isPending && pendingConnector?.uid === connector.uid

                return (
                  <button
                    className="wallet-option"
                    disabled={isPending}
                    key={connector.uid}
                    onClick={() => {
                      window.localStorage.removeItem(BASE_AUTO_CONNECT_DISMISSED_KEY)
                      connect({ connector })
                      setIsOpen(false)
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <Check size={16} />
                    <span>{isConnecting ? 'Connecting' : readableConnectorName(connector.name)}</span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
