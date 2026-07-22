import { useState } from 'react'

export default function Tabs({ tabs, defaultTab, onChange, className = '' }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  function handleClick(id) {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className={`border-b border-cream ${className}`}>
      <div className="flex gap-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-cream'
            }`}
          >
            {tab.icon && <tab.icon className="mr-1.5 inline h-4 w-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 rounded-full bg-cream px-1.5 py-0.5 text-xs">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
