import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ title, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-cream-light">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <Header title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
