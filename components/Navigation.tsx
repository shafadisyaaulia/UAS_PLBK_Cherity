'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  FlaskConical, 
  Home, 
  LayoutDashboard, 
  Beaker, 
  Settings,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Award,
  Zap
} from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { 
      href: '/beranda', 
      label: 'Beranda', 
      icon: Home,
      description: 'Halaman Utama'
    },
    { 
      href: '/modules', 
      label: 'Materi', 
      icon: LayoutDashboard,
      description: 'Materi Pembelajaran'
    },
    { 
      href: '/praktikum/ph-meter', 
      label: 'Praktikum', 
      icon: LayoutDashboard,
      description: 'Virtual Lab',
      badge: 'Live'
    },
    { 
      href: '/experiments', 
      label: 'Test', 
      icon: Beaker,
      description: 'Uji Pemahaman'
    },
    { 
      href: '/data-analysis', 
      label: 'Achievement', 
      icon: Award,
      description: 'Badge & Pencapaian'
    },
    { 
      href: '/about', 
      label: 'Tentang', 
      icon: User,
      description: 'Tentang SOLVIA'
    },
  ]

  const notifications = [
    { id: 1, text: 'New experiment: Buffer Solution', time: '5m ago', unread: true },
    { id: 2, text: 'Safety tip: Always wear goggles', time: '1h ago', unread: true },
    { id: 3, text: 'Report generated successfully', time: '2h ago', unread: false },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-panel border-b border-cyan-400/30 backdrop-blur-xl shadow-lg shadow-cyan-500/10' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link href="/beranda" className="group flex items-center gap-3 relative hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <FlaskConical className="w-10 h-10 text-cyan-400 glow-cyan-soft relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all">
                  SOLVIA
                </span>
                <span className="text-xs text-cyan-400/60 font-semibold tracking-wider">SMART LAB</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 glow-cyan-soft' 
                        : 'text-cyan-100/70 hover:text-cyan-300 hover:bg-cyan-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : ''
                      }`} />
                      <span className="font-semibold text-sm">{link.label}</span>
                      {link.badge && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    
                    {/* Hover tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 glass-card border-cyan-400/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      <div className="text-xs text-cyan-100">{link.description}</div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-500/20 rotate-45" />
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent glow-cyan" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Section: Notifications + User */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="glass-card border-cyan-400/20 p-2.5 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all relative group"
                >
                  <Bell className="w-5 h-5 text-cyan-400/70 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>

                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 glass-panel border border-cyan-400/30 rounded-2xl shadow-xl shadow-cyan-500/10 overflow-hidden">
                    <div className="p-4 border-b border-cyan-400/20">
                      <div className="flex items-center justify-between">
                        <h3 className="text-cyan-100 font-bold">Notifications</h3>
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                          {notifications.filter(n => n.unread).length} new
                        </span>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-cyan-400/10 hover:bg-cyan-500/5 transition-colors ${
                            notif.unread ? 'bg-cyan-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {notif.unread && <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2" />}
                            <div className="flex-1">
                              <p className="text-cyan-100 text-sm">{notif.text}</p>
                              <p className="text-cyan-400/50 text-xs mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 glass-card border-cyan-400/30 px-4 py-2 rounded-full hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full" />
                  </div>
                  <span className="hidden md:block text-cyan-100 text-sm font-semibold">Guest</span>
                  <ChevronDown className="w-4 h-4 text-cyan-400/70 group-hover:text-cyan-400 transition-transform group-hover:rotate-180" />
                </button>

                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 glass-panel border border-cyan-400/30 rounded-2xl shadow-xl shadow-cyan-500/10 overflow-hidden">
                    <div className="p-4 border-b border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-cyan-100 font-bold">Guest User</div>
                          <div className="text-cyan-400/60 text-xs">guest@solvia.lab</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-500/10 transition-colors group w-full">
                        <Settings className="w-4 h-4 text-cyan-400/70 group-hover:text-cyan-400" />
                        <span className="text-cyan-100/80 text-sm">Settings</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-cyan-400/20">
                      <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors group w-full">
                        <LogOut className="w-4 h-4 text-red-400/70 group-hover:text-red-400" />
                        <span className="text-red-400/80 text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Status Indicator */}
              <div className="hidden xl:flex items-center gap-2 glass-card border-green-400/30 px-3 py-2 rounded-full">
                <Zap className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-semibold">AI Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      </nav>

      {/* Overlay when dropdowns open */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </>
  )
}
