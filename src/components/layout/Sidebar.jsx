import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Briefcase, Calendar, CheckSquare, FileText,
  BarChart3, Settings, UserPlus, FileEdit, Zap, Headphones, Trash2,
  ChevronLeft, ChevronRight, Building2
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/associates', label: 'Associates', icon: UserPlus },
  { to: '/cv-builder', label: 'CV Builder', icon: FileEdit },
  { to: '/job-generator', label: 'Job Generator', icon: Zap },
  { to: '/receptionist-view', label: 'Receptionist', icon: Headphones },
  { type: 'divider' },
  { to: '/recycle-bin', label: 'Recycle Bin', icon: Trash2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-full flex-col border-r border-cream bg-beige transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-cream px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <Building2 className="h-5 w-5" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-primary truncate">Naim CRM</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((item, i) => {
          if (item.type === 'divider') {
            return <div key={i} className="my-2 border-t border-cream" />
          }
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-cream hover:text-text-primary'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <button
        onClick={onToggle}
        className="flex h-10 items-center justify-center border-t border-cream text-text-secondary hover:bg-cream hover:text-primary transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}
