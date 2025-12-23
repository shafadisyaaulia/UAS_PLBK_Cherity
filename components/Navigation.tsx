'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/experiments', label: 'Experiments' },
    { href: '/data-analysis', label: 'Data Analysis' },
    { href: '/login', label: 'Login' },
  ]

  return (
    <nav className="bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-blue/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-gradient">
            AI-Safe Lab
          </Link>
          
          <div className="flex gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link pb-1 ${
                  pathname === link.href ? 'text-cyber-blue' : ''
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
