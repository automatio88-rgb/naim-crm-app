import { useState, useRef, useEffect } from 'react'
import { Bell, Search, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from '../ui/Avatar'

export default function Header({ title }) {
  const { user, userProfile, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-cream bg-white/80 backdrop-blur-sm px-6">
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="rounded-lg p-2 text-text-secondary hover:bg-cream hover:text-primary transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>

        <button className="relative rounded-lg p-2 text-text-secondary hover:bg-cream hover:text-primary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-cream transition-colors"
          >
            <Avatar name={userProfile?.display_name || user?.email} size="sm" />
            <span className="hidden text-sm font-medium text-text-primary md:block">
              {userProfile?.display_name || user?.email}
            </span>
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-cream bg-white py-1 shadow-lg animate-scale-in">
              <div className="border-b border-cream px-4 py-2">
                <p className="text-xs text-text-muted">{user?.email}</p>
                <p className="text-xs font-medium text-primary capitalize">{userProfile?.role || 'user'}</p>
              </div>
              <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-cream hover:text-primary transition-colors">
                <User className="h-4 w-4" /> Profile
              </a>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-cream hover:text-danger transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
