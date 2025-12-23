'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flask } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/landing', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/experiments', label: 'Experiments' },
    { href: '/data-analysis', label: 'Data Analysis' },
  ]

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/landing" className="flex items-center gap-3">
            <Flask className="w-8 h-8 text-cyan-400 glow-cyan-soft" />
            <span className="text-2xl font-bold text-gradient">SOLVIA</span>
          </Link>
          
          <div className="flex gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link pb-1 ${
                  pathname === link.href ? 'text-cyan-400 glow-cyan-soft' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
