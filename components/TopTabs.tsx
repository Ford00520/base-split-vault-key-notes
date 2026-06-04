'use client'

import { Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'Contract', icon: Home }
]

export function TopTabs() {
  const pathname = usePathname()

  return (
    <nav className="top-tabs" aria-label="Primary navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link className={active ? 'tab active' : 'tab'} href={tab.href} key={tab.href}>
            <Icon size={16} />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
