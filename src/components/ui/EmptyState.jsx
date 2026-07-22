import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title = 'No data', description = 'No items to display.', action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="mb-4 rounded-full bg-cream p-4">
        <Icon className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="mb-1 text-lg font-medium text-text-primary">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-text-secondary">{description}</p>
      {action}
    </div>
  )
}
