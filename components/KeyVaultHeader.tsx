'use client'

import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { WalletButton } from './WalletButton'
import { TopTabs } from './TopTabs'

export function KeyVaultHeader() {
  return (
    <header className="vault-header">
      <Link className="brand-lock" href="/">
        <span className="brand-mark">
          <ShieldCheck size={18} />
        </span>
        <span>
          <strong>base-split-vault-key-notes</strong>
          <small>Sealed key note vault</small>
        </span>
      </Link>
      <TopTabs />
      <WalletButton />
    </header>
  )
}
